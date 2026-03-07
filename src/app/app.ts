import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AboutMe } from './components/about-me/about-me';
import { Projects } from './components/projects/projects';
import { DraggableDirective } from './directives/draggable';
import { en } from './i18n/en';
import { pt } from './i18n/pt';
import { WindowId, WindowManagerService } from './services/window-manager';

type WindowAnimationState = 'idle' | 'opening' | 'closing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AboutMe, Projects, DraggableDirective, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly windowManager = inject(WindowManagerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  private readonly animationMs = 180;
  private readonly animationTimers: Partial<Record<WindowId, ReturnType<typeof setTimeout>>> = {};

  readonly minimizedWindows = this.windowManager.minimizedWindows;
  readonly currentTime = signal(this.buildCurrentTime());
  readonly currentLang = signal<'en' | 'pt'>('en');
  readonly isStartMenuOpen = signal(false);
  readonly windowAnimations = signal<Record<WindowId, WindowAnimationState>>({
    main: 'idle',
    projects: 'idle'
  });

  readonly actions = [
    { type: 'minimize', label: '_' },
    { type: 'maximize', label: '?' },
    { type: 'close', label: 'X' }
  ];

  constructor() {
    this.translate.setTranslation('en', en);
    this.translate.setTranslation('pt', pt);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    const intervalId = setInterval(() => {
      this.currentTime.set(this.buildCurrentTime());
    }, 1000);

    this.destroyRef.onDestroy(() => {
      clearInterval(intervalId);
      Object.values(this.animationTimers).forEach((timerId) => {
        if (timerId) clearTimeout(timerId);
      });
    });
  }

  isWindowVisible(windowName: WindowId): boolean {
    const target = this.windowManager.getWindow(windowName);
    return target.isOpen && !target.isMinimized;
  }

  getWindowAnimation(windowName: WindowId): WindowAnimationState {
    return this.windowAnimations()[windowName];
  }

  getWindowZIndex(windowName: WindowId): number {
    return this.windowManager.getWindow(windowName).zIndex;
  }

  bringToFront(windowName: WindowId): void {
    this.windowManager.bringToFront(windowName);
  }

  openWindow(windowName: WindowId): void {
    this.windowManager.openWindow(windowName);
    this.playOpenAnimation(windowName);
  }

  restoreWindow(windowName: WindowId): void {
    this.windowManager.restoreWindow(windowName);
    this.playOpenAnimation(windowName);
  }

  getWindowLabelKey(windowId: WindowId): string {
    return windowId === 'main' ? 'window.mainTitle' : 'window.projectsTitle';
  }

  setLanguage(lang: 'en' | 'pt'): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    this.closeStartMenu();
  }

  isLanguageActive(lang: 'en' | 'pt'): boolean {
    return this.currentLang() === lang;
  }

  toggleStartMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isStartMenuOpen.update((state) => !state);
  }

  closeStartMenu(): void {
    this.isStartMenuOpen.set(false);
  }

  onDesktopIconPointerUp(event: PointerEvent, windowName: WindowId): void {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      this.openWindow(windowName);
      return;
    }

    if (event.pointerType === 'mouse' && event.detail >= 2) {
      this.openWindow(windowName);
    }
  }

  handleAction(type: string, windowName: WindowId): void {
    if (type === 'minimize') {
      this.playCloseAnimation(windowName, () => this.windowManager.minimizeWindow(windowName));
      return;
    }

    if (type === 'maximize') {
      this.restoreWindow(windowName);
      return;
    }

    if (type === 'close') {
      this.playCloseAnimation(windowName, () => this.windowManager.closeWindow(windowName));
    }
  }

  private playOpenAnimation(windowName: WindowId): void {
    this.clearAnimationTimer(windowName);
    this.setWindowAnimation(windowName, 'opening');
    this.animationTimers[windowName] = setTimeout(() => {
      this.setWindowAnimation(windowName, 'idle');
    }, this.animationMs);
  }

  private playCloseAnimation(windowName: WindowId, closeFn: () => void): void {
    if (!this.isWindowVisible(windowName)) {
      closeFn();
      return;
    }

    this.clearAnimationTimer(windowName);
    this.setWindowAnimation(windowName, 'closing');
    this.animationTimers[windowName] = setTimeout(() => {
      closeFn();
      this.setWindowAnimation(windowName, 'idle');
    }, this.animationMs);
  }

  private clearAnimationTimer(windowName: WindowId): void {
    const timer = this.animationTimers[windowName];
    if (!timer) return;
    clearTimeout(timer);
    this.animationTimers[windowName] = undefined;
  }

  private setWindowAnimation(windowName: WindowId, state: WindowAnimationState): void {
    this.windowAnimations.update((current) => ({
      ...current,
      [windowName]: state
    }));
  }

  private buildCurrentTime(): string {
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}

