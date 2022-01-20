declare type SvgrComponent = React.FC<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

declare module '*.svg' {
  const value: SvgrComponent;
  export default value;
}
