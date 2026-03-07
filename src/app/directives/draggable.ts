import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  private dragging = false;
  private offset = { x: 0, y: 0 };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.canStartDrag(target)) return;

    this.dragging = true;
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.offset.x = event.clientX - rect.left;
    this.offset.y = event.clientY - rect.top;
    event.preventDefault(); 
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (!this.canStartDrag(target)) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.dragging = true;
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.offset.x = touch.clientX - rect.left;
    this.offset.y = touch.clientY - rect.top;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      const x = event.clientX - this.offset.x;
      const y = event.clientY - this.offset.y;
      
      this.renderer.setStyle(this.el.nativeElement, 'left', `${x}px`);
      this.renderer.setStyle(this.el.nativeElement, 'top', `${y}px`);
      this.renderer.setStyle(this.el.nativeElement, 'margin', `0`); 
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.dragging) return;
    const touch = event.touches[0];
    if (!touch) return;

    const x = touch.clientX - this.offset.x;
    const y = touch.clientY - this.offset.y;

    this.renderer.setStyle(this.el.nativeElement, 'left', `${x}px`);
    this.renderer.setStyle(this.el.nativeElement, 'top', `${y}px`);
    this.renderer.setStyle(this.el.nativeElement, 'margin', `0`);
    event.preventDefault();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.dragging = false;
  }

  private canStartDrag(target: HTMLElement): boolean {
    if (!target.closest('.win-header')) return false;
    if (target.closest('.actions')) return false;
    if (target.closest('button, a, input, textarea, select')) return false;
    return true;
  }
}
