function focusRouteHeading(): void {
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLHeadingElement>('h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const announcer = document.querySelector<HTMLElement>('#route-announcer');
    if (announcer) announcer.textContent = document.title;
  });
}

focusRouteHeading();
addEventListener('pageshow', focusRouteHeading);
