import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-DHjgR8Xf.js";import{C as i,S as a,_ as o,a as s,b as c,c as l,d as u,f as d,g as f,h as p,i as m,l as h,m as g,n as _,o as v,p as y,r as b,s as x,t as S,u as C,v as w,w as T,x as E,y as D}from"./icon-sun.component-Dt7irR-0.js";var O;function init_icons(){return(init_icons=e((()=>{T(),a(),c(),w(),f(),g(),d(),C(),l(),v(),m(),_(),O={menu:u,close:o,"arrow-right":E,"arrow-down":i,plus:b,minus:h,external:p,sun:S,moon:s,monitor:x,check:D,github:y}})))()}var k=t({AllGlyphs:()=>j,InheritedColor:()=>M,__namedExportsOrder:()=>N,default:()=>A}),A,j,M,N;function init_icon_stories(){return(init_icon_stories=e((()=>{r(),init_icons(),A={title:`Icon`,decorators:[n({imports:Object.values(O)})]},j={render:()=>({template:`
            <ul class="glyphs">
                ${Object.keys(O).map(e=>`
                <li class="glyph">
                    <dma-icon-${e} />
                    <code>${e}</code>
                </li>`).join(``)}
            </ul>
        `,styles:[`
                .glyphs {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    color: var(--color-foreground-default);
                    font-family: var(--typography-caption-font-family);
                    font-size: var(--typography-caption-font-size);
                    line-height: var(--typography-caption-line-height);
                }

                .glyph {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-8);
                }
            `]})},M={render:()=>({template:`
            <p class="muted-text">
                <dma-icon-github />
                Muted text, and an icon in the same color
            </p>
        `,styles:[`
                .muted-text {
                    display: flex;
                    align-items: center;
                    gap: var(--space-8);
                    margin: 0;
                    color: var(--color-foreground-muted);
                    font-family: var(--typography-body-font-family);
                    font-size: var(--typography-body-font-size);
                    line-height: var(--typography-body-line-height);
                }
            `]})},N=[`AllGlyphs`,`InheritedColor`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <ul class="glyphs">
                \${Object.keys(ICONS).map(glyph => \`
                <li class="glyph">
                    <dma-icon-\${glyph} />
                    <code>\${glyph}</code>
                </li>\`).join('')}
            </ul>
        \`,
    styles: [\`
                .glyphs {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    color: var(--color-foreground-default);
                    font-family: var(--typography-caption-font-family);
                    font-size: var(--typography-caption-font-size);
                    line-height: var(--typography-caption-line-height);
                }

                .glyph {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-8);
                }
            \`]
  })
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <p class="muted-text">
                <dma-icon-github />
                Muted text, and an icon in the same color
            </p>
        \`,
    styles: [\`
                .muted-text {
                    display: flex;
                    align-items: center;
                    gap: var(--space-8);
                    margin: 0;
                    color: var(--color-foreground-muted);
                    font-family: var(--typography-body-font-family);
                    font-size: var(--typography-body-font-size);
                    line-height: var(--typography-body-line-height);
                }
            \`]
  })
}`,...M.parameters?.docs?.source}}}})))()}export{init_icon_stories as i,M as n,k as r,j as t};