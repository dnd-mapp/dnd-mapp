import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./logo.stories-PZLlrT4l.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,...n(),...e.components};return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(o,{of:d}),`
`,(0,m.jsx)(t.h1,{id:`logo`,children:`Logo`}),`
`,(0,m.jsx)(t.p,{children:`The D&D Mapp logo: the mark, the hexagon of the brand, with or without the wordmark. It is the Logo component of the design system in Penpot.`}),`
`,(0,m.jsx)(a,{of:p}),`
`,(0,m.jsx)(i,{of:p}),`
`,(0,m.jsx)(t.h2,{id:`kind`,children:`Kind`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`kind`}),` picks what the logo shows. Use `,(0,m.jsx)(t.code,{children:`LogoKind.Full`}),`, the default, wherever there is room for the name. Use `,(0,m.jsx)(t.code,{children:`LogoKind.Mark`}),` where space is short.`]}),`
`,(0,m.jsx)(a,{of:f}),`
`,(0,m.jsx)(t.h2,{id:`size`,children:`Size`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`size`}),` picks how large the logo draws. Use `,(0,m.jsx)(t.code,{children:`LogoSize.Large`}),`, the default, in headers. Use `,(0,m.jsx)(t.code,{children:`LogoSize.Small`}),` in menus and footers, where the logo sits next to smaller text.`]}),`
`,(0,m.jsx)(a,{of:u}),`
`,(0,m.jsx)(a,{of:l}),`
`,(0,m.jsx)(t.h2,{id:`colors`,children:`Colors`}),`
`,(0,m.jsx)(t.p,{children:`The mark keeps the brand colors in both color schemes, since it is brand art. The wordmark takes the default foreground color, so it reads on the page background of either theme.`}),`
`,(0,m.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,m.jsx)(t.p,{children:`The logo is an image named "D&D Mapp" in every variant, and it hides the mark from assistive technology, so screen readers announce the name once. A link around the logo takes that name, so the link needs no label of its own.`}),`
`,(0,m.jsx)(t.h2,{id:`linking-home`,children:`Linking home`}),`
`,(0,m.jsx)(t.p,{children:`The logo renders no link. Header, Mobile menu, and Footer wrap it in the link to the home page, since they know where home is:`}),`
`,(0,m.jsx)(t.pre,{children:(0,m.jsx)(t.code,{className:`language-html`,children:`<a routerLink="/">
    <dma-logo />
</a>
`})}),`
`,(0,m.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,m.jsxs)(t.p,{children:[(0,m.jsx)(t.code,{children:`LogoHarness`}),` from `,(0,m.jsx)(t.code,{children:`@dnd-mapp/ui-web/testing`}),` reads the logo in a test: its name, the text of its wordmark, and the size of its mark.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,m.jsx)(t,{...e,children:(0,m.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var m;function init_logo(){return(init_logo=e((()=>{m=s(),t(),r(),c()})))()}init_logo();export{MDXContent as default};