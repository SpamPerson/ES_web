import { useEffect, useState } from 'react';
import { Stack } from '../styled.components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PAGE_ITEM_COUNT } from '../../constants/common.constants';

interface PPaging {
   currentPageNum: number;
   totalItemsCount: number;
   setCurrentPageNum?: (pageNum: number) => void;
}

export const Paging: React.FC<PPaging> = (props) => {
   const [visiblePageNum, setVisiblePageNum] = useState<number[]>([]);

   useEffect(() => {
      let newVisiblePageNum: number[] = [];

      for (let i = 0; i < Math.ceil(props.totalItemsCount / PAGE_ITEM_COUNT); ++i) {
         newVisiblePageNum.push(i);
      }
      setVisiblePageNum(newVisiblePageNum);
   }, [props]);

   const onClickPage = (pageNum: number) => {
      props.setCurrentPageNum!(pageNum);
   };

   const onClickPrevPage = () => {
      if (props.currentPageNum - 1 !== 0 && visiblePageNum.length > 0) props.setCurrentPageNum!(props.currentPageNum - 1);
   };

   const onClickNextPage = () => {
      if (props.currentPageNum + 1 !== visiblePageNum[visiblePageNum.length - 1] + 2 && visiblePageNum.length > 0)
         props.setCurrentPageNum!(props.currentPageNum + 1);
   };

   return (
      <Stack
         $horizontal
         $horizontalAlign="center"
         $verticalAlign="center"
         $childrenGap={10}
         style={{ padding: 40, fontSize: 20, userSelect: 'none' }}
      >
         <FiChevronLeft
            onClick={onClickPrevPage}
            style={{
               cursor: 'pointer',
               color: props.currentPageNum - 1 === 0  ? '#e0e0e0' : undefined,
            }}
         />

         {visiblePageNum.length > 0 && props.totalItemsCount > PAGE_ITEM_COUNT ? (
            visiblePageNum.map((value, index) => {
               let pageNum = value + 1;
               let isCurrentPage = value + 1 === props.currentPageNum;
               return (
                  <Stack
                     key={`${value}_pageNum`}
                     style={{ cursor: 'pointer', color: isCurrentPage ? 'red' : undefined }}
                     onClick={() => onClickPage(pageNum)}
                  >
                     {pageNum}
                  </Stack>
               );
            })
         ) : (
            <Stack style={{ cursor: 'pointer', color: 'red' }}>1</Stack>
         )}
         <FiChevronRight
            onClick={onClickNextPage}
            style={{
               cursor: 'pointer',
               color:
                  props.currentPageNum + 1 !== visiblePageNum[visiblePageNum.length - 1] + 2 && props.totalItemsCount > PAGE_ITEM_COUNT
                     ? undefined
                     : '#e0e0e0',
            }}
         />
      </Stack>
   );
};
