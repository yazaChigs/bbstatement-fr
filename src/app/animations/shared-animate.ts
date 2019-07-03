import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state
} from '@angular/animations';
export const transitionAnimation = [
    transition(':enter', [
      style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
      animate('0.7s cubic-bezier(.8, -0.6, 0.26, 1.6)',
        style({ transform: 'scale(1)', opacity: 1 }))  // final
    ]),
    transition(':leave', [
      style({ transform: 'scale(1)', opacity: 1, height: '*' }),
      animate('0.6s cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({
          transform: 'scale(0.5)', opacity: 0,
          height: '0px', margin: '0px'
        }))
    ])
  ];
  export const fadeInOutAnimation = [
    state('void', style({
      opacity: 0
    })),
    transition('void <=> *', animate(1000)),
  ];
