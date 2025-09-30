function setDynamicBackgroundHeight() {
  if (window.innerHeight > 768) {
    const group  = document.querySelector('.groups-ghc .group-ghc');
    // return console.log(group.offsetHeight);
    const bg = document.querySelector('.background');
    if (group && bg) {
      let height = (group.offsetHeight * 3 + 20) + "px";
      if (height < "683px") height = "683px";
      console.log(height);
      bg.style.minHeight = height;
    } else {
      const bg = document.querySelector('.background');
      if (bg) bg.style.minHeight = '';
    }
  }
}

window.addEventListener('resize', setDynamicBackgroundHeight);
window.addEventListener('load', setDynamicBackgroundHeight);