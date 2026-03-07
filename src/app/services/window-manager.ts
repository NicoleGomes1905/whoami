import { Injectable, computed, signal } from '@angular/core';

export type WindowId = 'main' | 'projects';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly topZIndex = signal(11);

  private readonly windowsState = signal<Record<WindowId, WindowState>>({
    main: {
      id: 'main',
      title: 'NicoleGomes.exe',
      isOpen: true,
      isMinimized: false,
      zIndex: 10
    },
    projects: {
      id: 'projects',
      title: 'Projects',
      isOpen: true,
      isMinimized: false,
      zIndex: 11
    }
  });

  readonly minimizedWindows = computed(() =>
    Object.values(this.windowsState()).filter(
      (window) => window.isOpen && window.isMinimized
    )
  );

  getWindow(windowId: WindowId): WindowState {
    return this.windowsState()[windowId];
  }

  bringToFront(windowId: WindowId): void {
    const target = this.getWindow(windowId);
    if (!target.isOpen) return;

    this.topZIndex.update((current) => current + 1);
    this.patchWindow(windowId, { zIndex: this.topZIndex() });
  }

  openWindow(windowId: WindowId): void {
    this.patchWindow(windowId, { isOpen: true, isMinimized: false });
    this.bringToFront(windowId);
  }

  minimizeWindow(windowId: WindowId): void {
    const target = this.getWindow(windowId);
    if (!target.isOpen) return;
    this.patchWindow(windowId, { isMinimized: true });
  }

  closeWindow(windowId: WindowId): void {
    this.patchWindow(windowId, { isOpen: false, isMinimized: false });
  }

  restoreWindow(windowId: WindowId): void {
    this.patchWindow(windowId, { isOpen: true, isMinimized: false });
    this.bringToFront(windowId);
  }

  private patchWindow(windowId: WindowId, patch: Partial<WindowState>): void {
    this.windowsState.update((current) => ({
      ...current,
      [windowId]: {
        ...current[windowId],
        ...patch
      }
    }));
  }
}
