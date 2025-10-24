import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
})
export class Hero implements OnInit {
  index = 0;
  mouseX = 0;
  mouseY = 0;

  slides = [
    {
      title: 'Full Stack Developer',
      subtitle: 'Building efficient and scalable web solutions with modern technologies.',
      bgClass: 'bg-dark',
      images: [
        { src: '/assets/logos/angular.png', top: '10%', left: '15%' },
        { src: '/assets/logos/html5.png', top: '30%', left: '70%' },
        { src: '/assets/logos/js.png', top: '60%', left: '25%' },
        { src: '/assets/logos/node.png', top: '75%', left: '60%' },
        { src: '/assets/logos/android.png', top: '40%', left: '10%' },
        { src: '/assets/logos/flutter.png', top: '20%', left: '80%' },
      ],
    },
    {
      title: 'Graphic Designer',
      subtitle: 'Creating stunning visuals that bring ideas to life.',
      bgClass: 'bg-dark',
      images: [
        { src: '/assets/logos/adobe.png', top: '15%', left: '30%' },
        { src: '/assets/logos/pen.png', top: '45%', left: '65%' },
        { src: '/assets/logos/palette.png', top: '70%', left: '20%' },
        { src: '/assets/logos/figma.png', top: '25%', left: '75%' },
      ],
    },
    {
      title: 'Tutor',
      subtitle: 'Empowering students through practical coding and creative design lessons.',
      bgClass: 'bg-dark',
      images: [
        { src: '/assets/logos/teacher.png', top: '20%', left: '20%' },
        { src: '/assets/logos/book.png', top: '55%', left: '60%' },
        { src: '/assets/logos/laptop.png', top: '35%', left: '80%' },
        { src: '/assets/logos/graduation.png', top: '70%', left: '15%' },
      ],
    },
  ];

  ngOnInit() {
    setInterval(() => this.next(), 5000);
  }

  next() {
    this.index = (this.index + 1) % this.slides.length;
  }

  prev() {
    this.index = (this.index - 1 + this.slides.length) % this.slides.length;
  }

  goTo(i: number) {
    this.index = i;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
    this.mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
  }
}
