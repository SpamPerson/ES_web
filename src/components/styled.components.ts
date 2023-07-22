import styled, { css, keyframes } from 'styled-components';

export type AlignmentType = AlignmentBaseType | SpradeType;
export type SpradeType = 'space-between' | 'space-around' | 'space-evenly';
export type AlignmentBaseType = 'center' | 'start' | 'end';
export type PenalPositionType = 'left' | 'right';

export interface IStack {
   horizontal?: boolean;
   verticalAlign?: AlignmentType;
   horizontalAlign?: AlignmentType;
   childrenGap?: number;
}

export interface IStackItem {
   align?: AlignmentBaseType;
}

export interface INavLoginLink {
   top?: number;
   bottom?: number;
   left?: number;
   right?: number;
}

export interface IPenal {
   position?: PenalPositionType;
}

export const Stack = styled.div<IStack>`
   display: flex;
   ${(props) => {
      let alignItems: string | undefined;
      let justifyContent: string | undefined;

      switch (props.horizontal) {
         case true:
            alignItems = props.verticalAlign;
            justifyContent = props.horizontalAlign;
            break;
         case false:
            alignItems = props.horizontalAlign;
            justifyContent = props.verticalAlign;
            break;
      }

      switch (alignItems) {
         case 'center':
            alignItems = 'center';
            break;
         case 'start':
            alignItems = 'flex-start';
            break;
         case 'end':
            alignItems = 'flex-end';
            break;
         default:
            alignItems = undefined;
            break;
      }

      return css`
         box-sizing: border-box;
         flex-flow: ${props.horizontal ? 'row' : 'column'} nowrap;
         align-items: ${alignItems};
         justify-content: ${justifyContent};
         gap: ${props.childrenGap ? `${props.childrenGap}px` : undefined};
      `;
   }}
`;

export const StackItem = styled.div<IStackItem>`
   ${(props) => css`
      font-size: 14px;
      align-self: ${props.align};
   `}
`;

export const TopNavStack = styled(Stack)`
   height: 60px;
   padding: 10px;
   border-bottom: 1px solid #e0e0e0;
`;

export const NavLoginLink = styled(StackItem)<INavLoginLink>`
   ${(props) => css`
      top: ${props.top ? `${props.top}px` : undefined};
      bottom: ${props.bottom ? `${props.bottom}px` : undefined};
      left: ${props.left ? `${props.left}px` : undefined};
      right: ${props.right ? `${props.right}px` : undefined};
   `}
   position: absolute;
   user-select: none;
   cursor: pointer;
   &:hover {
      color: blue;
   }
`;

export const MenuItem = styled(StackItem)`
   cursor: pointer;
   font-weight: 500;
   font-size: 16px;
   &:hover {
      color: #eeeeee;
   }
`;

const animationSidePanel = keyframes`
   0% {
      left:-300px;
   }
   100% {
      left:0px;
   }
`;

export const SidePanel = styled(Stack)<IPenal>`
   ${(props) => {
      let left: number | undefined = undefined;
      let right: number | undefined = undefined;

      switch (props.position) {
         case 'left':
            left = 0;
            break;
         case 'right':
            right = 0;
            break;
      }

      return css`
         position: absolute;
         height: 100%;
         z-index: 9999;
         background-color: #ffffff;
         width: 300px;
         padding: 5px;
         left: ${left};
         right: ${right};
         box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
         animation-name: ${animationSidePanel};
         animation-duration: .3s;
         animation-fill-mode: none;
      `;
   }}
`;

export const DisableWrapper = styled(Stack)`
   width: 100%;
   height: 100%;
   position: absolute;
   background: #ffffff;
   opacity: 0.5;
   z-index: 997;
`;

export const LoginButton = styled.button`
   padding: 10px;
   border-radius: 3px;
   font-size: 1rem;
   font-weight: 700;
   background-color: #204ef5;
   color: #ffffff;
   border: none;
   width: 100%;
   cursor: pointer;
   &:hover {
      background-color: #e0e0e0;
   }
`;
