import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,c as l,d as u,f as d,g as f,h as p,i as m,l as h,m as g,n as _,o as v,p as y,r as b,s as x,t as S,u as C}from"./button.stories-BMgHo48C.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(o,{of:p}),`
`,(0,w.jsx)(t.h1,{id:`button`,children:`Button`}),`
`,(0,w.jsx)(t.p,{children:`An action, such as submitting, opening, or toggling. It is the Button component of the design system in Penpot, and Header and Mobile menu hold it.`}),`
`,(0,w.jsx)(a,{of:c}),`
`,(0,w.jsx)(i,{of:c}),`
`,(0,w.jsx)(t.h2,{id:`placing-a-button`,children:`Placing a button`}),`
`,(0,w.jsxs)(t.p,{children:[`Button is an attribute on `,(0,w.jsx)(t.code,{children:`<button>`}),` or `,(0,w.jsx)(t.code,{children:`<a>`}),`, so the element keeps its native semantics and keyboard behavior. Use `,(0,w.jsx)(t.code,{children:`<button>`}),` for an action on the page, and `,(0,w.jsx)(t.code,{children:`<a>`}),` with `,(0,w.jsx)(t.code,{children:`routerLink`}),` or `,(0,w.jsx)(t.code,{children:`href`}),` for one that goes to another page; Button needs no router:`]}),`
`,(0,w.jsx)(t.pre,{children:(0,w.jsx)(t.code,{className:`language-html`,children:`<button dma-button type="button" (click)="save()">Save</button>

<a dma-button routerLink="/maps/new">New map</a>
`})}),`
`,(0,w.jsxs)(t.p,{children:[`A `,(0,w.jsx)(t.code,{children:`<button>`}),` in a form submits it unless it has `,(0,w.jsx)(t.code,{children:`type="button"`}),`, as in any form, so give every other button that type.`]}),`
`,(0,w.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`kind`}),` picks how the button looks. Each kind draws a default, a hover, and a focus state.`]}),`
`,(0,w.jsx)(t.h3,{id:`primary`,children:`Primary`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`ButtonKind.Primary`}),`, the default, marks the main action of a view. Use one primary button per view, so the reader sees at once what the view is for.`]}),`
`,(0,w.jsx)(a,{of:x}),`
`,(0,w.jsx)(a,{of:m}),`
`,(0,w.jsx)(t.h3,{id:`secondary`,children:`Secondary`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`ButtonKind.Secondary`}),` marks the other calls to action of a view. It draws a strong border and no fill until hover.`]}),`
`,(0,w.jsx)(a,{of:u}),`
`,(0,w.jsx)(a,{of:y}),`
`,(0,w.jsx)(t.h3,{id:`quiet`,children:`Quiet`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`ButtonKind.Quiet`}),` marks the tools in the header and menu, such as the Menu and GitHub buttons of Header and the Close button of Mobile menu. It draws the lighter border of a control and no fill until hover.`]}),`
`,(0,w.jsx)(a,{of:l}),`
`,(0,w.jsx)(a,{of:C}),`
`,(0,w.jsx)(t.h2,{id:`icons`,children:`Icons`}),`
`,(0,w.jsxs)(t.p,{children:[`Place a `,(0,w.jsx)(t.code,{children:`dma-icon-*`}),` before the label to lead it, or after it to trail it. The button needs no input for it: it draws the icon 24 px, 8 px from the label, and in the color of the label.`]}),`
`,(0,w.jsx)(t.pre,{children:(0,w.jsx)(t.code,{className:`language-html`,children:`<button dma-button type="button"><dma-icon-plus />New map</button>
`})}),`
`,(0,w.jsx)(a,{of:_}),`
`,(0,w.jsx)(a,{of:g}),`
`,(0,w.jsxs)(t.p,{children:[`An icon hides itself from assistive technology, so a button with an icon of its own needs an `,(0,w.jsx)(t.code,{children:`aria-label`}),` to name it. It keeps the padding of a button with a label.`]}),`
`,(0,w.jsx)(t.pre,{children:(0,w.jsx)(t.code,{className:`language-html`,children:`<button dma-button type="button" kind="quiet" aria-label="Close"><dma-icon-close /></button>
`})}),`
`,(0,w.jsx)(a,{of:S}),`
`,(0,w.jsx)(t.h2,{id:`width`,children:`Width`}),`
`,(0,w.jsx)(t.p,{children:`Below the desktop breakpoint, a button fills a block, column, or grid container, as the GitHub button of Mobile menu does. In a flex row, it keeps the width of its content, as the Menu button of Header does. From the breakpoint up, every button keeps the width of its content.`}),`
`,(0,w.jsx)(a,{of:b,story:{inline:!1,height:`10rem`}}),`
`,(0,w.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,w.jsx)(t.p,{children:`Every kind draws the focus ring outside itself on keyboard focus, and keeps the look of its default state.`}),`
`,(0,w.jsx)(a,{of:v}),`
`,(0,w.jsx)(a,{of:d}),`
`,(0,w.jsx)(a,{of:h}),`
`,(0,w.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,w.jsxs)(t.p,{children:[`The projected content names the button to assistive technology, unless the button has an `,(0,w.jsx)(t.code,{children:`aria-label`}),`, and the element keeps its role: `,(0,w.jsx)(t.code,{children:`button`}),` on `,(0,w.jsx)(t.code,{children:`<button>`}),`, and `,(0,w.jsx)(t.code,{children:`link`}),` on `,(0,w.jsx)(t.code,{children:`<a>`}),`. Every kind meets the 44 px target size.`]}),`
`,(0,w.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,w.jsxs)(t.p,{children:[(0,w.jsx)(t.code,{children:`ButtonHarness`}),` from `,(0,w.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads a button in a test: its text, its look, its size, its focus ring, and its icons with where each one sits.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,w.jsx)(t,{...e,children:(0,w.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var w;function init_button(){return(init_button=e((()=>{w=s(),t(),r(),f()})))()}init_button();export{MDXContent as default};