import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WindowManagerService } from '../../services/window-manager';

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
})
export class AboutMe {
  private readonly windowManager = inject(WindowManagerService);

  openProjects(): void {
    this.windowManager.openWindow('projects');
  }

  downloadCV(): void {
    const filePath = 'NicoleGGomes_CV.pdf';
    
    const link = document.createElement('a');
    link.href = filePath;
    
    link.download = 'Nicole_Gomes_CV.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
