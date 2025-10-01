function setDynamicBackgroundHeight() {
  if (window.innerWidth < 768) {
    const group = document.querySelector('.groups-ghc .group-ghc');
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
  } else {
    const group = document.querySelector('.groups-ghc .group-ghc');
    const bg = document.querySelector('.background');
    if (group && bg) {
      let height = groups.offsetHeight + 20 + "px";
      if (bg) bg.style.maxHeight = height;
    }
  }
}

window.addEventListener('resize', setDynamicBackgroundHeight);
window.addEventListener('load', setDynamicBackgroundHeight);