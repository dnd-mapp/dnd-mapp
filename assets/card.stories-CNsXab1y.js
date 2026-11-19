import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,H as r,I as i,j as a,mt as o,pt as s,w as c}from"./angular-platform-e5VfW5pO.js";import{a as l,r as u,t as d}from"./dist-B-70Eai5.js";import{n as f,t as p}from"./arg-types-T86RJuJ3.js";import{a as m,n as h,t as g}from"./chip.component-CSovCT75.js";import{t as _}from"./link.component-wSLcnZDx.js";import{t as v}from"./link-CW6s-jj9.js";var y;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9jYXJkL2NhcmQuY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9jYXJkL2NhcmQuY29tcG9uZW50Lmh0bWw=e((()=>{y=`<ng-content select="h1, h2, h3, h4, h5, h6" />
<ng-content select="p" />
<div class="chips"><ng-content select="dma-chip" /></div>
<ng-content select="a" />
`})))()}var b;function init_card_component(){return(init_card_component=e((()=>{b=`dma-card{box-sizing:border-box;align-items:stretch;gap:var(--space-12);min-width:var(--size-card-min);padding:calc(var(--space-24) - var(--border-width-default));border:var(--border-width-default) solid var(--color-border-divider);border-radius:var(--radius-lg);background:var(--color-background-surface);flex-direction:column;display:flex}dma-card.raised{background:var(--color-background-raised)}dma-card>*{margin:0}dma-card>:is(h1,h2,h3,h4,h5,h6){color:var(--color-foreground-default);font-family:var(--typography-title-font-family);font-size:var(--typography-title-font-size);font-weight:var(--typography-title-font-weight);letter-spacing:var(--typography-title-letter-spacing);line-height:var(--typography-title-line-height);-webkit-text-decoration:var(--typography-title-text-decoration);text-decoration:var(--typography-title-text-decoration);text-transform:var(--typography-title-text-case)}dma-card>p{color:var(--color-foreground-muted);font-family:var(--typography-body-font-family);font-size:var(--typography-body-font-size);font-weight:var(--typography-body-font-weight);letter-spacing:var(--typography-body-letter-spacing);line-height:var(--typography-body-line-height);-webkit-text-decoration:var(--typography-body-text-decoration);text-decoration:var(--typography-body-text-decoration);text-transform:var(--typography-body-text-case)}dma-card>.chips{align-items:center;gap:var(--space-8);flex-wrap:wrap;display:flex}dma-card>.chips:empty{display:none}dma-card>a{align-self:flex-start}`})))()}function cardBackgroundAttr(e){return Object.values(x).includes(e)?e:S}var x,S;function init_card_types(){return(init_card_types=e((()=>{x={Surface:`surface`,Raised:`raised`},S=x.Surface})))()}var C;function init_card_component$1(){return(init_card_component$1=e((()=>{o(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9jYXJkL2NhcmQuY29tcG9uZW50Lmh0bWw(),init_card_component(),n(),init_card_types(),C=class CardComponent{background=c(S,{transform:cardBackgroundAttr});static propDecorators={background:[{type:i,args:[{isSignal:!0,alias:`background`,required:!1,transform:void 0}]}]}},C=s([a({selector:`dma-card`,template:y,encapsulation:r.None,host:{"[class.raised]":`background() === 'raised'`},styles:[b]})],C)})))()}function init_chip(){return(init_chip=e((()=>{h(),m()})))()}var w=t({Examples:()=>O,Raised:()=>D,Surface:()=>E,__namedExportsOrder:()=>k,default:()=>T}),T,E,D,O,k;function init_card_stories(){return(init_card_stories=e((()=>{d(),init_card_component$1(),init_card_types(),init_chip(),v(),p(),T={title:`Patterns/Card`,component:C,decorators:[l({imports:[g,_]})],argTypes:{background:f({values:x,typeName:`CardBackground`,defaultValue:S,description:`What the card fills itself with, by what it sits on: surface, on the page background, or raised, on a surface.`}),title:{description:`The heading the card projects, at the level the page needs.`,control:`text`},text:{description:"The `<p>` the card projects below the title.",control:`text`}},render:e=>({props:e,template:`
            <div class="column">
                <dma-card [background]="background">
                    <h3>{{ title }}</h3>
                    <p>{{ text }}</p>
                </dma-card>
            </div>
        `,styles:[`
                .column {
                    max-inline-size: 36rem;
                }
            `]})},E={args:{background:`surface`,title:`Card title`,text:`A sentence or two of supporting text that explains the title.`}},D={args:{background:`raised`,title:`Card title`,text:`A sentence or two of supporting text that explains the title.`},decorators:[u(e=>`<div style="padding: var(--space-24); border-radius: var(--radius-lg); background: var(--color-background-surface)">${e}</div>`)]},O={render:()=>({template:`
            <ul class="cards" role="list">
                <li>
                    <dma-card>
                        <h3>Characters</h3>
                        <p>Build character sheets and keep their spell books.</p>
                        <dma-chip>Players</dma-chip>
                        <dma-chip kind="dm">DM</dma-chip>
                        <a dma-link kind="standalone" href="#">Open your characters</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Worlds and campaigns</h3>
                        <p>Write the lore of your world, draw its maps, and keep notes of every session.</p>
                        <a dma-link kind="standalone" href="#">Start a world</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Encounters</h3>
                        <p>Build encounters and write stats for custom monsters.</p>
                        <dma-chip kind="status">Planned</dma-chip>
                    </dma-card>
                </li>
            </ul>
        `,styles:[`
                .cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(var(--size-card-min), 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .cards > li {
                    display: grid;
                }
            `]})},k=[`Surface`,`Raised`,`Examples`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    background: 'surface',
    title: 'Card title',
    text: 'A sentence or two of supporting text that explains the title.'
  }
}`,...E.parameters?.docs?.source},description:{story:`A card on the page background, with its title and text, as Penpot draws it by default.`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    background: 'raised',
    title: 'Card title',
    text: 'A sentence or two of supporting text that explains the title.'
  },
  decorators: [componentWrapperDecorator(story => \`<div style="padding: var(--space-24); border-radius: var(--radius-lg); background: var(--color-background-surface)">\${story}</div>\`)]
}`,...D.parameters?.docs?.source},description:{story:`A card on a surface, which the story draws around it, so the card stands one step above its background.`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <ul class="cards" role="list">
                <li>
                    <dma-card>
                        <h3>Characters</h3>
                        <p>Build character sheets and keep their spell books.</p>
                        <dma-chip>Players</dma-chip>
                        <dma-chip kind="dm">DM</dma-chip>
                        <a dma-link kind="standalone" href="#">Open your characters</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Worlds and campaigns</h3>
                        <p>Write the lore of your world, draw its maps, and keep notes of every session.</p>
                        <a dma-link kind="standalone" href="#">Start a world</a>
                    </dma-card>
                </li>
                <li>
                    <dma-card>
                        <h3>Encounters</h3>
                        <p>Build encounters and write stats for custom monsters.</p>
                        <dma-chip kind="status">Planned</dma-chip>
                    </dma-card>
                </li>
            </ul>
        \`,
    styles: [\`
                .cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(var(--size-card-min), 1fr));
                    gap: var(--space-24);
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .cards > li {
                    display: grid;
                }
            \`]
  })
}`,...O.parameters?.docs?.source},description:{story:"A grid of cards in a list, each in an `<li>` of its own, with and without chips and an action.",...O.parameters?.docs?.description}}}})))()}export{init_card_stories as a,w as i,D as n,E as r,O as t};