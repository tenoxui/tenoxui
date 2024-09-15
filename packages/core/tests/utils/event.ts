// simulate hover event
export function hover(elem: HTMLElement) {
  const mouseenterEvent = new Event("mouseover");
  elem.dispatchEvent(mouseenterEvent);
}

// unhover element
export function unHover(elem: HTMLElement) {
  const mouseleaveEvent = new Event("mouseout");
  elem.dispatchEvent(mouseleaveEvent);
}

export function screenSize(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
    window.dispatchEvent(new Event('resize'));
  }