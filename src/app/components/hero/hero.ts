import {
  Component,
  HostListener,
  QueryList,
  ViewChildren,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  group,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  animations: [ 
    // ... your animations (slideChange, starFloat) remain unchanged ... 
    trigger('slideChange', [
      transition(':increment', [
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateX(50px)' }),
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateX(0)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              animate(
                '600ms ease-in',
                style({ opacity: 0, transform: 'translateX(-50px)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition(':decrement', [
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateX(-50px)' }),
              animate(
                '600ms ease-out',
                style({ opacity: 1, transform: 'translateX(0)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              animate(
                '600ms ease-in',
                style({ opacity: 0, transform: 'translateX(50px)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
    trigger('starFloat', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0) rotate(0deg)' }),
        animate(
          '800ms ease-out',
          style({ opacity: 1, transform: 'scale(1) rotate(360deg)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '800ms ease-in',
          style({ opacity: 0, transform: 'scale(0) rotate(-360deg)' })
        ),
      ]),
    ]),
  ],
})
export class Hero implements AfterViewInit {
  currentIndex = 0;
  mouseX = 0;
  mouseY = 0;
  scrollY = 0;

  @ViewChildren('slideSection') sections!: QueryList<ElementRef>;
  private sectionTops: number[] = [];

  // --- (NEW) ---
  // Add these two properties for scroll locking
  private isAnimating = false;
  private scrollDuration = 800; // Animation duration in ms
  // --- (END NEW) ---

  // ... slides data remains unchanged ...
  slides = [
    {
      title: 'Full Stack Developer',
      subtitle:
        'Building efficient and scalable web solutions with modern technologies.',
      bgClass: 'bg-dark',
      images: [
        { src: './assets/logos/angular.png', depth: 40, top: '10%', left: '15%' },
        { src: './assets/logos/html5.png', depth: 20, top: '30%', left: '70%' },
        { src: './assets/logos/js.png', depth: 60, top: '60%', left: '25%' },
        { src: './assets/logos/node.png', depth: 25, top: '75%', left: '60%' },
        { src: './assets/logos/android.png', depth: 15, top: '40%', left: '10%' },
        { src: './assets/logos/flutter.png', depth: 35, top: '20%', left: '80%' },
        
      ],
      // (NEW) Add this socials array
      socials: [
        { name: 'GitHub', url: 'https://github.com/your-username', icon: 'fa-brands fa-github' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/your-username', icon: 'fa-brands fa-linkedin' }
      ]
    },
    {
      title: 'Graphic Designer',
      subtitle: 'Creating stunning visuals that bring ideas to life.',
      bgClass: 'bg-dark',
      images: [
        { src: './assets/logos/adobe.png', depth: 25, top: '15%', left: '30%' },
        { src: './assets/logos/pen.png', depth: 40, top: '45%', left: '65%' },
        { src: './assets/logos/palette.png', depth: 30, top: '70%', left: '20%' },
        { src: './assets/logos/figma.png', depth: 35, top: '25%', left: '75%' },
        
      ],
      // (NEW) Add this socials array
      socials: [
        { name: 'Dribbble', url: 'https://dribbble.com/your-username', icon: 'fa-brands fa-dribbble' },
        { name: 'Behance', url: 'https://behance.net/your-username', icon: 'fa-brands fa-behance' }
      ]
    },
    {
      title: 'Tutor',
      subtitle:
        'Empowering students through practical coding and creative design lessons.',
      bgClass: 'bg-dark',
      images: [
        { src: './assets/logos/teacher.png', depth: 40, top: '20%', left: '20%' },
        { src: './assets/logos/book.png', depth: 15, top: '55%', left: '60%' },
        { src: './assets/logos/laptop.png', depth: 25, top: '35%', left: '80%' },
        { src: './assets/logos/graduation.png', depth: 30, top: '70%', left: '15%' },
        
      ],
      // (NEW) Add this socials array
      socials: [
        { name: 'YouTube', url: 'https://youtube.com/your-channel', icon: 'fa-brands fa-youtube' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/your-username', icon: 'fa-brands fa-linkedin' }
      ]
    },
  ];

  ngAfterViewInit() {
    // We need to run this on a timeout to ensure all sections are rendered
    setTimeout(() => this.calculateSectionTops(), 0);
  }

  trackByFn(index: number, _: any) {
    return index;
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateSectionTops();
  }

  calculateSectionTops() {
    this.sectionTops = this.sections.map(
      (section) => section.nativeElement.offsetTop
    );
  }

  // --- (NEW) ---
  // This new function handles the 'wheel' event to trigger the snap
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    // Prevent the default scroll behavior
    event.preventDefault();

    // If we are already animating, ignore this scroll event
    if (this.isAnimating) {
      return;
    }

    const direction = event.deltaY > 0 ? 'down' : 'up';
    let targetIndex = this.currentIndex;

    // Calculate the target index
    if (direction === 'down') {
      targetIndex = Math.min(this.currentIndex + 1, this.slides.length - 1);
    } else {
      targetIndex = Math.max(this.currentIndex - 1, 0);
    }

    // If we're not changing sections, do nothing
    if (targetIndex === this.currentIndex) {
      return;
    }

    // Set the animation lock
    this.isAnimating = true;

    // Scroll to the target section
    const targetScrollTop = this.sectionTops[targetIndex];
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    // Release the animation lock after the animation is complete
    setTimeout(() => {
      this.isAnimating = false;
    }, this.scrollDuration);
  }
  // --- (END NEW) ---

  // This (existing) function now *reacts* to the smooth scroll
  // and updates the text at the right time.
  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrollY = window.scrollY;

    const viewportCenter = this.scrollY + window.innerHeight / 2;
    let closestSectionIndex = 0;
    let minDistance = Infinity;

    this.sectionTops.forEach((top, index) => {
      const sectionHeight = window.innerHeight;
      const sectionCenter = top + sectionHeight / 2;
      const distance = Math.abs(viewportCenter - sectionCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestSectionIndex = index;
      }
    });

    if (this.currentIndex !== closestSectionIndex) {
      this.currentIndex = closestSectionIndex;
    }
  }

  // ... onMouseMove and getParallaxTransform remain unchanged ...
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.mouseX = (e.clientX - centerX) * 0.03;
    this.mouseY = (e.clientY - centerY) * 0.03;
  }

  getParallaxTransform(img: any): string {
    const mouseXOffset = this.mouseX / img.depth;
    const mouseYOffset = this.mouseY / img.depth;
    const scrollOffset = -this.scrollY / (img.depth / 5);

    return `translate3d(${mouseXOffset}px, ${
      mouseYOffset + scrollOffset
    }px, 0)`;
  }
}