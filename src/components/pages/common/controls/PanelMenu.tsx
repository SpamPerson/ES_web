import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TbNotebook, TbNotes, TbUserCog, TbZoomQuestion } from 'react-icons/tb';

import { AuthenticationContext } from '../../../contexts/context';

import { Styles } from 'styled-components/dist/types';
import { Stack } from '../../../styled.components';
import { IAuthenticationContext, MenuType, RoleName } from '../../../types';

interface PPanelMenu {
   closePanel: () => void;
}

export const PanelMenu: React.FC<PPanelMenu> = (props) => {
   const { authentication } = useContext<IAuthenticationContext>(AuthenticationContext);
   const [isAdmin, setIsAdmin] = useState<boolean>(false);

   const navigate = useNavigate();

   useEffect(() => {
      if (authentication?.user?.roles?.findIndex((element) => element.name === RoleName.Admin)! > -1) {
         setIsAdmin(true);
      }
   }, [authentication]);

   const navChildrenGap = 5;
   const commonNavStyle: React.CSSProperties = {
      padding: 5,
      cursor: 'pointer',
      fontSize: 18,
      fontWeight: '500',
   };

   const commonNavStyles: Styles<Object> = {
      '&:hover': {
         color: 'rgb(52, 152, 219)',
      },
   };

   const onClickMenu = (menuType: MenuType) => {
      navigate(`/${menuType}`);
      props.closePanel();
   };

   return (
      <Stack $horizontalAlign="center" style={{ height: '100%', width: '100%', userSelect: 'none' }}>
         <Stack $childrenGap={20} style={{ height: '100%', width: '100%', padding: 20 }}>
            <Stack
               $horizontal
               $childrenGap={navChildrenGap}
               $verticalAlign="center"
               style={commonNavStyle}
               $styles={commonNavStyles}
               onClick={() => onClickMenu(MenuType.Word)}
            >
               <TbNotes />
               <span>단어장</span>
            </Stack>
            <Stack
               $horizontal
               $childrenGap={navChildrenGap}
               $verticalAlign="center"
               style={commonNavStyle}
               $styles={commonNavStyles}
               onClick={() => onClickMenu(MenuType.Sentence)}
            >
               <TbNotebook />
               <span>문장노트</span>
            </Stack>
            <Stack
               $horizontal
               $childrenGap={navChildrenGap}
               $verticalAlign="center"
               style={commonNavStyle}
               $styles={commonNavStyles}
               onClick={() => onClickMenu(MenuType.Ai)}
            >
               <TbZoomQuestion />
               <span>AI 검색</span>
            </Stack>
         </Stack>
         {isAdmin && (
            <Stack
               $horizontal
               $childrenGap={navChildrenGap}
               $verticalAlign="center"
               style={{ ...commonNavStyle, padding: 20 }}
               $styles={commonNavStyles}
               onClick={() => onClickMenu(MenuType.UserManager)}
            >
               <TbUserCog />
               <span>유저 관리</span>
            </Stack>
         )}
      </Stack>
   );
};
