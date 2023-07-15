import styled, { css } from 'styled-components';

export type AlignmentType = AlignmentBaseType | SpradeType;
export type SpradeType = 'space-between' | 'space-around' | 'space-evenly';
export type AlignmentBaseType = 'center' | 'start' | 'end';

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
