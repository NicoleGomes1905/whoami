import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  selectedOption = signal<string>('About Me');
  showMenu = signal<boolean>(false);

  menuOptions = [
    { id: 1, label: 'About Me'},
    { id: 2, label: 'Projects'},
    { id: 3, label: 'Habilities'},
    { id: 4, label: 'Contacts'}
  ]

  selectOption(label: string) {
    this.selectedOption.set(label); 
    this.showMenu.set(false);       

    const element = document.getElementById(label);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openSelectOptions() {
    this.showMenu.update(value => !value);
  }


}
