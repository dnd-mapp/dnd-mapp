import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./theme-picker.stories-RFer_LT_.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(o,{of:d}),`
`,(0,_.jsx)(t.h1,{id:`theme-picker`,children:`Theme picker`}),`
`,(0,_.jsx)(t.p,{children:`Lets the reader pick the color scheme: System, Light, or Dark. It is the Theme picker component of the design system in Penpot, with a Theme option component for each choice, and Header, Mobile menu, and Footer hold it.`}),`
`,(0,_.jsx)(a,{of:c}),`
`,(0,_.jsx)(i,{of:c}),`
`,(0,_.jsx)(t.h2,{id:`placing-a-picker`,children:`Placing a picker`}),`
`,(0,_.jsxs)(t.p,{children:[`Theme picker is an attribute on `,(0,_.jsx)(t.code,{children:`<fieldset>`}),`, so the options form one group of native radio inputs. It reads and saves the choice through `,(0,_.jsx)(t.code,{children:`ThemeService`}),`, so it needs no inputs or outputs to work:`]}),`
`,(0,_.jsx)(t.pre,{children:(0,_.jsx)(t.code,{className:`language-html`,children:`<fieldset dma-theme-picker></fieldset>

<fieldset dma-theme-picker display="icons"></fieldset>
`})}),`
`,(0,_.jsx)(t.p,{children:`Each picker gives its radio inputs a name of its own, so a page can hold more than one. Every picker shows the same choice, since they share the service. On a prerendered page, a picker shows System until the app starts and the service reads the saved choice.`}),`
`,(0,_.jsx)(t.h2,{id:`display`,children:`Display`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`display`}),` picks how the options show. Each option draws a default, a hover, a focus, and a selected state.`]}),`
`,(0,_.jsx)(t.h3,{id:`labels`,children:`Labels`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`ThemePickerDisplay.Labels`}),`, the default, shows each icon with its label.`]}),`
`,(0,_.jsx)(a,{of:h}),`
`,(0,_.jsx)(a,{of:p}),`
`,(0,_.jsx)(a,{of:g}),`
`,(0,_.jsx)(t.h3,{id:`icons`,children:`Icons`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`ThemePickerDisplay.Icons`}),` shows the icons alone, for places where space is tight.`]}),`
`,(0,_.jsx)(a,{of:f}),`
`,(0,_.jsx)(a,{of:u}),`
`,(0,_.jsx)(a,{of:m}),`
`,(0,_.jsx)(t.h2,{id:`keyboard`,children:`Keyboard`}),`
`,(0,_.jsx)(t.p,{children:`Tab moves focus to the selected option, and the arrow keys move the choice to the next or previous option, as in any group of radio inputs. The option with focus draws the focus ring outside itself, and keeps the look of its state.`}),`
`,(0,_.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,_.jsx)(t.p,{children:`The picker is a group named "Theme", and each option is a radio input named by its label. The icons display hides the labels from sight but not from assistive technology, so each option keeps its name. The icons hide themselves, so screen readers announce each label once. In forced colors mode, the selected option takes the highlight color as its border.`}),`
`,(0,_.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,_.jsxs)(t.p,{children:[(0,_.jsx)(t.code,{children:`ThemePickerHarness`}),` from `,(0,_.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a picker in a test: its themes, its selected theme, the names of its radio inputs, and its options. `,(0,_.jsx)(t.code,{children:`ThemeOptionHarness`}),` reads each option: its theme, whether it is checked, and its look, size, icon size, label, and focus ring. In these stories, a stand-in for `,(0,_.jsx)(t.code,{children:`ThemeService`}),` picks the selected option, so a click leaves the theme of the preview to the theme toolbar.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,_.jsx)(t,{...e,children:(0,_.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var _;function init_theme_picker(){return(init_theme_picker=e((()=>{_=s(),t(),r(),l()})))()}init_theme_picker();export{MDXContent as default};