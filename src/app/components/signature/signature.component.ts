import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements AfterViewInit {
  // a reference to the canvas element from our template
  @ViewChild('canvas') public canvas: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;
  constructor() { }

  ngOnInit() {
  }

  public ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    // set some default properties about the line
    this.cx.lineWidth = 1;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    
    // we'll implement this method to start capturing mouse events
    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
  // this will capture all mousedown events from the canvas element
  fromEvent(canvasEl, 'mousedown')
    .pipe(
      switchMap((e) => {
        // after a mouse down, we'll record all mouse moves
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event    
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point    
            pairwise()
          )
      })
    )
    .subscribe((res: [MouseEvent, MouseEvent]) => {
      const rect = canvasEl.getBoundingClientRect();

      // previous and current position with the offset
      const prevPos = {
        x: res[0].clientX - rect.left,
        y: res[0].clientY - rect.top
      };

      const currentPos = {
        x: res[1].clientX - rect.left,
        y: res[1].clientY - rect.top
      };

      // this method we'll implement soon to do the actual drawing
      this.drawOnCanvas(prevPos, currentPos);
    });

  // this will capture all touchstart events from the canvas element
  fromEvent(canvasEl, 'touchstart')
  .pipe(
    switchMap((e) => {
      // after a mouse down, we'll record all mouse moves
      return fromEvent(canvasEl, 'touchmove')
        .pipe(
          // we'll stop (and unsubscribe) once the user releases the mouse
          // this will trigger a 'mouseup' event    
          takeUntil(fromEvent(canvasEl, 'touchend')),
          // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
          takeUntil(fromEvent(canvasEl, 'touchcancel')),
          // pairwise lets us get the previous value to draw a line from
          // the previous point to the current point    
          pairwise()
        )
    })
  )
  .subscribe((res: [TouchEvent, TouchEvent]) => {
    const rect = canvasEl.getBoundingClientRect();

    // previous and current position with the offset
    const prevPos = {
      x: res[0].changedTouches[0].clientX - rect.left,
      y: res[0].changedTouches[0].clientY - rect.top
    };

    const currentPos = {
      x: res[1].changedTouches[0].clientX - rect.left,
      y: res[1].changedTouches[0].clientY - rect.top
    };
    res[0].preventDefault();
    res[1].preventDefault();
    // this method we'll implement soon to do the actual drawing
    this.drawOnCanvas(prevPos, currentPos);
  });
}

private drawOnCanvas(
  prevPos: { x: number, y: number }, 
  currentPos: { x: number, y: number }
) {
  // incase the context is not set
  if (!this.cx) { return; }

  // start our drawing path
  this.cx.beginPath();

  // we're drawing lines so we need a previous position
  if (prevPos) {
    // sets the start point
    this.cx.moveTo(prevPos.x, prevPos.y); // from

    // draws a line from the start pos until the current position
    this.cx.lineTo(currentPos.x, currentPos.y);

    // strokes the current path with the styles we set earlier
    this.cx.stroke();
  }
}

  public save(event){    
    var imageSource = this.canvas.nativeElement.toDataURL();
    console.log(imageSource)
    alert('Mock save - check console to see the base64 value of image.')
  }

  public clear(event){
    const context = this.canvas.nativeElement.getContext('2d');

    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
}
