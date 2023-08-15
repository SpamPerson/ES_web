import { Stack } from '../styled.components';
import { FiChevronLeft } from 'react-icons/fi';

interface PPaging {
   currentPageNum: number;
   totalPageNum: number;
}

export const Paging: React.FC<PPaging> = (props) => {
   return (
      <Stack $horizontal $horizontalAlign="center" style={{ padding: 40 }}>
         <FiChevronLeft />
      </Stack>
   );
};
