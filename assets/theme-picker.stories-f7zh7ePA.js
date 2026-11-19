import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./arg-types-T86RJuJ3.js";import{c as i,l as a,n as o,o as s,r as c,t as l,u}from"./theme-picker.component-Bk-ZepiW.js";import{n as d,t as f}from"./theme--WByyVV1.js";var p=t({DarkSelected:()=>C,IconsDefault:()=>b,IconsFocus:()=>S,IconsHover:()=>x,LabelsDefault:()=>_,LabelsFocus:()=>y,LabelsHover:()=>v,__namedExportsOrder:()=>w,default:()=>m}),m,h,g,_,v,y,b,x,S,C,w;function init_theme_picker_stories(){return(init_theme_picker_stories=e((()=>{o(),u(),r(),f(),c(),m={title:`Patterns/Theme picker`,component:l,argTypes:{display:n({values:a,typeName:`ThemePickerDisplay`,defaultValue:i,description:`How the options show: each icon with its label, or the icons alone where space is tight.`})},decorators:[d(s.System)],render:e=>({props:e,template:`<fieldset dma-theme-picker [display]="display"></fieldset>`})},h={pseudo:{hover:`label:has(input[value="light"])`}},g={pseudo:{focusVisible:`input[value="system"]`}},_={args:{display:`labels`}},v={args:{display:`labels`},parameters:h},y={args:{display:`labels`},parameters:g},b={args:{display:`icons`}},x={args:{display:`icons`},parameters:h},S={args:{display:`icons`},parameters:g},C={args:{display:`labels`},decorators:[d(s.Dark)]},w=[`LabelsDefault`,`LabelsHover`,`LabelsFocus`,`IconsDefault`,`IconsHover`,`IconsFocus`,`DarkSelected`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  parameters: hover
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  parameters: focus
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  },
  parameters: hover
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  },
  parameters: focus
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  decorators: [withSelectedTheme(Theme.Dark)]
}`,...C.parameters?.docs?.source},description:{story:`Dark selected, as the picker shows it to a reader who picked Dark.`,...C.parameters?.docs?.description}}}})))()}export{_ as a,init_theme_picker_stories as c,x as i,p as l,b as n,y as o,S as r,v as s,C as t};