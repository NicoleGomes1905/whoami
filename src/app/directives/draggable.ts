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
    if (target.closest('.win-header')) {
      this.dragging = true;

      const rect = this.el.nativeElement.getBoundingClientRect();
      this.offset.x = event.clientX - rect.left;
      this.offset.y = event.clientY - rect.top;
      event.preventDefault(); 
    }
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

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }
}
