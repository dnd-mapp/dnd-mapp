import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,O as r,nt as i,rt as a,v as o,y as s}from"./angular-platform-CcDFnmS-.js";import{n as c,t as l}from"./arg-types-T86RJuJ3.js";var u;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2NoaXAvY2hpcC5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2NoaXAvY2hpcC5jb21wb25lbnQuaHRtbA=e((()=>{u=`<ng-content />
`})))()}var d;function init_chip_component(){return(init_chip_component=e((()=>{d=`:host{box-sizing:border-box;padding:calc(var(--space-4) - var(--border-width-default)) calc(var(--space-8) - var(--border-width-default));border:var(--border-width-default) solid var(--color-border-divider);border-radius:var(--radius-pill);background:var(--color-background-raised);color:var(--color-foreground-default);font-family:var(--typography-label-font-family);font-size:var(--typography-label-font-size);font-weight:var(--typography-label-font-weight);letter-spacing:var(--typography-label-letter-spacing);line-height:var(--typography-label-line-height);text-transform:var(--typography-label-text-case);white-space:nowrap;align-items:center;display:inline-flex}:host(.status){border-color:var(--color-border-control);color:var(--color-foreground-muted);background:0 0}:host(.dm){background:var(--color-secondary-default);color:var(--color-foreground-on-secondary);border-color:#0000}`})))()}function chipKindAttr(e){return Object.values(f).includes(e)?e:p}var f,p;function init_chip_types(){return(init_chip_types=e((()=>{f={Neutral:`neutral`,Status:`status`,Dm:`dm`},p=f.Neutral})))()}var m;function init_chip_component$1(){return(init_chip_component$1=e((()=>{a(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2NoaXAvY2hpcC5jb21wb25lbnQuaHRtbA(),init_chip_component(),o(),init_chip_types(),m=class ChipComponent{kind=s(p,{transform:chipKindAttr});static propDecorators={kind:[{type:r,args:[{isSignal:!0,alias:`kind`,required:!1,transform:void 0}]}]}},m=i([n({selector:`dma-chip`,template:u,host:{"[class.status]":`kind() === 'status'`,"[class.dm]":`kind() === 'dm'`},styles:[d]})],m)})))()}var h=t({Dm:()=>y,Examples:()=>b,Neutral:()=>_,Status:()=>v,__namedExportsOrder:()=>x,default:()=>g}),g,_,v,y,b,x;function init_chip_stories(){return(init_chip_stories=e((()=>{init_chip_component$1(),init_chip_types(),l(),g={title:`Chip`,component:m,argTypes:{kind:c({values:f,typeName:`ChipKind`,defaultValue:p,description:`How the chip looks: neutral, for tool names and conditions, status, for features that are not built yet, or DM, for tools meant for dungeon masters.`}),label:{description:`The content the chip projects, which carries its meaning.`,control:`text`}},render:e=>({props:e,template:`<dma-chip [kind]="kind">{{ label }}</dma-chip>`})},_={args:{kind:`neutral`,label:`Label`}},v={args:{kind:`status`,label:`Planned`}},y={args:{kind:`dm`,label:`DM`}},b={render:()=>({template:`
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-8)">
                <dma-chip kind="status">Planned</dma-chip>
                <dma-chip kind="status">Concept</dma-chip>
                <dma-chip kind="dm">DM</dma-chip>
                <dma-chip>Poisoned</dma-chip>
                <dma-chip>Prone</dma-chip>
                <dma-chip>Spreadsheets</dma-chip>
            </div>
        `})},x=[`Neutral`,`Status`,`Dm`,`Examples`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'neutral',
    label: 'Label'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'status',
    label: 'Planned'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'dm',
    label: 'DM'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-8)">
                <dma-chip kind="status">Planned</dma-chip>
                <dma-chip kind="status">Concept</dma-chip>
                <dma-chip kind="dm">DM</dma-chip>
                <dma-chip>Poisoned</dma-chip>
                <dma-chip>Prone</dma-chip>
                <dma-chip>Spreadsheets</dma-chip>
            </div>
        \`
  })
}`,...b.parameters?.docs?.source},description:{story:`Chips in a row, as Card holds them.`,...b.parameters?.docs?.description}}}})))()}export{h as a,v as i,b as n,init_chip_stories as o,_ as r,y as t};