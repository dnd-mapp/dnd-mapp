import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{t as n}from"./dist-B-70Eai5.js";import{i as r,n as i,r as a,t as o}from"./on-this-page.component-rMivyYhW.js";var s=t({Article:()=>v,Desktop:()=>m,LinkCurrent:()=>f,LinkDefault:()=>l,LinkFocus:()=>d,LinkHover:()=>u,Links:()=>p,MobileClosed:()=>h,MobileOpen:()=>g,__namedExportsOrder:()=>y,default:()=>c}),c,l,u,d,f,p,m,h,g,_,v,y;function init_on_this_page_stories(){return(init_on_this_page_stories=e((()=>{n(),r(),i(),c={title:`Patterns/On this page`,component:a,subcomponents:{OnThisPageComponent:o},argTypes:{label:{description:`The content the link projects: the heading of its section, which names it to assistive technology.`,control:`text`},current:{description:'Whether the link marks the section in view, through `aria-current="location"` on the link.',control:`boolean`,table:{type:{summary:`boolean`},defaultValue:{summary:`false`}}}},render:e=>({props:e,template:`
            <div style="width: 240px">
                <a dma-on-this-page-link [attr.aria-current]="current ? 'location' : null" href="#section-heading">
                    {{ label }}
                </a>
            </div>
        `})},l={args:{label:`Section heading`,current:!1}},u={args:{label:`Section heading`,current:!1},parameters:{pseudo:{hover:!0}}},d={args:{label:`Section heading`,current:!1},parameters:{pseudo:{focusVisible:!0}}},f={args:{label:`Section heading`,current:!0}},p={render:()=>({template:`
            <div style="width: 240px">
                <a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a>
                <a dma-on-this-page-link href="#what-we-process">What we process</a>
                <a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a>
                <a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a>
                <a dma-on-this-page-link href="#your-rights">Your rights</a>
                <a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a>
            </div>
        `})},m={render:()=>({moduleMetadata:{imports:[o]},template:`
            <nav dma-on-this-page style="width: 240px">
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        `})},h={render:()=>({moduleMetadata:{imports:[o]},template:`
            <nav dma-on-this-page>
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        `}),globals:{viewport:{value:`mobile1`,isRotated:!1}}},g={...h,play:({canvasElement:e})=>{e.querySelector(`nav[dma-on-this-page] summary`)?.click()}},_=[{id:`article-who-is-responsible`,heading:`Who is responsible`},{id:`article-what-we-process`,heading:`What we process`},{id:`article-what-we-dont-do`,heading:`What we don’t do`},{id:`article-who-else-sees-it`,heading:`Who else sees it`},{id:`article-your-rights`,heading:`Your rights`},{id:`article-changes-to-this-statement`,heading:`Changes to this statement`}],v={render:()=>({moduleMetadata:{imports:[o]},props:{sections:_,paragraphs:[1,2,3,4]},template:`
            <div style="display: grid; grid-template-columns: 240px minmax(0, 60ch); gap: var(--space-48)">
                <nav dma-on-this-page>
                    @for (section of sections; track section.id) {
                        <li><a dma-on-this-page-link [href]="'#' + section.id">{{ section.heading }}</a></li>
                    }
                </nav>
                <article>
                    @for (section of sections; track section.id) {
                        <h2 [id]="section.id">{{ section.heading }}</h2>
                        @for (paragraph of paragraphs; track paragraph) {
                            <p>
                                A paragraph of {{ section.heading }}. The article runs long enough that the page scrolls
                                past each of its sections, so the mark in the nav follows the reader down the page.
                            </p>
                        }
                    }
                </article>
            </div>
        `})},y=[`LinkDefault`,`LinkHover`,`LinkFocus`,`LinkCurrent`,`Links`,`Desktop`,`MobileClosed`,`MobileOpen`,`Article`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Section heading',
    current: false
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Section heading',
    current: false
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Section heading',
    current: false
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Section heading',
    current: true
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <div style="width: 240px">
                <a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a>
                <a dma-on-this-page-link href="#what-we-process">What we process</a>
                <a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a>
                <a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a>
                <a dma-on-this-page-link href="#your-rights">Your rights</a>
                <a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a>
            </div>
        \`
  })
}`,...p.parameters?.docs?.source},description:{story:`The links of the Privacy page stacked as On this page lists them, with the first section in view.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => ({
    moduleMetadata: {
      imports: [OnThisPageComponent]
    },
    template: \`
            <nav dma-on-this-page style="width: 240px">
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        \`
  })
}`,...m.parameters?.docs?.source},description:{story:`On this page on Desktop, as Penpot draws it, with the first section in view, from the desktop breakpoint up. The page
has no headings for its links, so the nav leaves the marked link as it is.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => ({
    moduleMetadata: {
      imports: [OnThisPageComponent]
    },
    template: \`
            <nav dma-on-this-page>
                <li><a dma-on-this-page-link aria-current="location" href="#who-is-responsible">Who is responsible</a></li>
                <li><a dma-on-this-page-link href="#what-we-process">What we process</a></li>
                <li><a dma-on-this-page-link href="#what-we-dont-do">What we don’t do</a></li>
                <li><a dma-on-this-page-link href="#who-else-sees-it">Who else sees it</a></li>
                <li><a dma-on-this-page-link href="#your-rights">Your rights</a></li>
                <li><a dma-on-this-page-link href="#changes-to-this-statement">Changes to this statement</a></li>
            </nav>
        \`
  }),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...h.parameters?.docs?.source},description:{story:`On this page on Mobile, as Penpot draws it: a closed Disclosure that fills the width of the page, below the desktop
breakpoint. The docs page shows the story in an iframe narrower than the breakpoint.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  ...MobileClosed,
  play: ({
    canvasElement
  }) => {
    canvasElement.querySelector<HTMLElement>('nav[dma-on-this-page] summary')?.click();
  }
}`,...g.parameters?.docs?.source},description:{story:`On this page on Mobile with its panel open, as the reader opens it with a click on the summary.`,...g.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => ({
    moduleMetadata: {
      imports: [OnThisPageComponent]
    },
    props: {
      sections: SECTIONS,
      paragraphs: [1, 2, 3, 4]
    },
    template: \`
            <div style="display: grid; grid-template-columns: 240px minmax(0, 60ch); gap: var(--space-48)">
                <nav dma-on-this-page>
                    @for (section of sections; track section.id) {
                        <li><a dma-on-this-page-link [href]="'#' + section.id">{{ section.heading }}</a></li>
                    }
                </nav>
                <article>
                    @for (section of sections; track section.id) {
                        <h2 [id]="section.id">{{ section.heading }}</h2>
                        @for (paragraph of paragraphs; track paragraph) {
                            <p>
                                A paragraph of {{ section.heading }}. The article runs long enough that the page scrolls
                                past each of its sections, so the mark in the nav follows the reader down the page.
                            </p>
                        }
                    }
                </article>
            </div>
        \`
  })
}`,...v.parameters?.docs?.source},description:{story:`On this page beside a long article on Desktop, as the Privacy page places it. As the article scrolls, the nav sticks
and marks the section whose heading has reached the top third of the viewport.`,...v.parameters?.docs?.description}}}})))()}export{d as a,h as c,s as d,l as i,g as l,m as n,u as o,f as r,p as s,v as t,init_on_this_page_stories as u};