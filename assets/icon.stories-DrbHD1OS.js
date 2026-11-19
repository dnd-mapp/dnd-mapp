import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-B-70Eai5.js";import{C as i,D as a,E as o,O as s,S as c,T as l,_ as u,a as d,b as f,c as p,d as m,f as h,g,h as _,i as v,l as y,m as b,n as x,o as S,p as C,r as w,s as T,t as E,u as D,v as O,w as k,x as A,y as j}from"./icon-sun.component-DF1-h-2U.js";var M;function init_icons(){return(init_icons=e((()=>{s(),o(),k(),c(),f(),O(),g(),b(),h(),D(),p(),S(),v(),x(),M={menu:m,close:u,"arrow-right":l,"arrow-down":a,"chevron-left":A,"chevron-right":j,plus:w,minus:y,external:_,sun:E,moon:d,monitor:T,check:i,github:C}})))()}var N=t({AllGlyphs:()=>F,InheritedColor:()=>I,__namedExportsOrder:()=>L,default:()=>P}),P,F,I,L;function init_icon_stories(){return(init_icon_stories=e((()=>{r(),init_icons(),P={title:`Elements/Icon`,decorators:[n({imports:Object.values(M)})]},F={render:()=>({template:`
            <ul class="glyphs">
                ${Object.keys(M).map(e=>`
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
            `]})},I={render:()=>({template:`
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
            `]})},L=[`AllGlyphs`,`InheritedColor`],F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}}})))()}export{init_icon_stories as i,I as n,N as r,F as t};