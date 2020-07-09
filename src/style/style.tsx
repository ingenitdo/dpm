const _blur = 4;

export const filter_blur = {
  webkitFilter: 'blur(' + _blur + 'px)',
  mozFilter: 'blur(' + _blur + 'px)',
  oFilter: 'blur(' + _blur + 'px)',
  msFilter: 'blur(' + _blur + 'px)',
  filter: 'blur(' + _blur + 'px)'
};

export const drop_shadow = {
  webkitBoxShadow: "3px 3px 6px 0px rgba(0,0,0,0.75)",
  mozBoxShadow: "3px 3px 6px 0px rgba(0,0,0,0.75)",
  boxShadow: "3px 3px 6px 0px rgba(0,0,0,0.75)"
};
