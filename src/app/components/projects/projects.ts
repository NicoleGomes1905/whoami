import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  imports: [TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  projectsList = [
    {
      nameKey: 'projects.pokemon.name',
      descriptionKey: 'projects.pokemon.description',
      repositoryLink: 'https://github.com/NicoleGomes1905/Pokemon-Weather-Finder',
      demoLink: 'https://nicolegomes1905.github.io/Pokemon-Weather-Finder/',
      imagePath: 'pokemon-weather.png'
    },
    {
      nameKey: 'projects.expatflow.name',
      descriptionKey: 'projects.expatflow.description',
      repositoryLink: 'https://github.com/NicoleGomes1905/expatflow',
      demoLink: 'https://nicolegomes1905.github.io/expatflow/',
      imagePath: 'expatflow.png'
    }
  ];
}
