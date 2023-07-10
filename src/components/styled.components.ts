import styled from 'styled-components';

export const flexDiv = styled.div`
    display: flex;
`

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
