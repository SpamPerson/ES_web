import { useContext, useEffect, useState } from 'react';
import { DetailsList } from '../controls/DetailsList';
import { Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../styled.components';
import { EditType, IColumn, IWord, WordSearchColumn } from '../types';
import { getWordList } from '../../services/word.request';
import { AuthenticationContext } from '../contexts/context';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { Paging } from '../controls/Paging';
import { PAGE_ITEM_COUNT } from '../../constants/common.constants';

export const WordWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [totalWordItems, setTotalWordItems] = useState<IWord[]>([]);
   const [visibleItems, setVisibleItems] = useState<IWord[]>([]);

   const [searchColumn, setSearchColumn] = useState<WordSearchColumn>(WordSearchColumn.EnWord);
   const [searchText, setSearchText] = useState<string>('');
   const [currentPageNum, setCurrentPageNum] = useState<number>(1);

   useEffect(() => {
      if (authentication) getWordItems();
   }, [authentication]);

   useEffect(() => {
      if (totalWordItems.length > 0) {
         let newVisibleItems = totalWordItems.slice(0, PAGE_ITEM_COUNT * currentPageNum);
         setVisibleItems(newVisibleItems);
      } else {
         setVisibleItems([]);
      }
   }, [totalWordItems]);

   useEffect(() => {
      const startNum = PAGE_ITEM_COUNT * (currentPageNum - 1) + 1;
      const endNum = PAGE_ITEM_COUNT * currentPageNum;
      let newVisibleItems = totalWordItems.slice(startNum - 1, endNum);

      setVisibleItems(newVisibleItems);
   }, [currentPageNum]);

   const getWordItems = async () => {
      const result = await getWordList(authentication!, searchText, searchColumn);
      if (result.isSuccess) {
         setTotalWordItems(result.data);
      }
   };

   const columns: IColumn[] = [
      { key: 'enWord', name: '단어', width: '20%', fieldName: 'enWord', editType: EditType.TextField },
      { key: 'krWord', name: '뜻', width: '20%', fieldName: 'krWord', editType: EditType.TextField },
      { key: 'createDate', name: '등록 일자', width: '10%', fieldName: 'createDate', editType: EditType.Calendar },
      { key: 'isMemorize', name: '암기 여부', width: '10%', fieldName: 'isMemorize', editType: EditType.Choice },
      { key: 'remarks', name: '비고', width: '30%', fieldName: 'remarks' },
   ];

   const onSelection = (items: any) => {
      console.log(items);
   };

   const onChangeSearchColumn = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSearchColumn(event.currentTarget.value as WordSearchColumn);
   };

   const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.currentTarget.value);
   };

   const onClickAdd = () => {};

   const onClickDelete = () => {};

   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>단어장</PageTitle>
         </Stack>
         <Stack $horizontal $horizontalAlign="space-between" $verticalAlign="center" style={{ padding: '0 40px' }}>
            <Stack $horizontal $verticalAlign="end" $childrenGap={10} style={{ height: '100%' }}>
               <Stack
                  $horizontal
                  $verticalAlign="center"
                  $childrenGap={5}
                  onClick={onClickAdd}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  $styles={{
                     '&:hover': {
                        color: '#5296d5',
                     },
                  }}
               >
                  <FiPlusCircle color="#5296d5" />
                  <span>추가</span>
               </Stack>
               <Stack
                  $horizontal
                  $verticalAlign="center"
                  $childrenGap={5}
                  onClick={onClickDelete}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  $styles={{
                     '&:hover': {
                        color: 'red',
                     },
                  }}
               >
                  <FiTrash2 color="red" />
                  <span>삭제</span>
               </Stack>
            </Stack>
            <Stack $horizontal $childrenGap={5} style={{ width: 400 }}>
               <StackItem style={{ width: 150 }}>
                  <Dropdown defaultValue={searchColumn} onChange={onChangeSearchColumn}>
                     <option value={WordSearchColumn.EnWord}>영단어</option>
                     <option value={WordSearchColumn.KrWord}>뜻</option>
                     <option value={WordSearchColumn.Remarks}>비고</option>
                  </Dropdown>
               </StackItem>
               <TextField placeholder="검색할 단어를 입력해 주세요" value={searchText} onChange={onChangeSearchText} />
               <Stack style={{ width: 200 }}>
                  <PrimaryButton onClick={getWordItems}>검색</PrimaryButton>
               </Stack>
            </Stack>
         </Stack>
         <Stack>
            <DetailsList columns={columns} items={visibleItems} isCheckBox selection={onSelection} isIndex />
         </Stack>
         <Stack>
            <Paging currentPageNum={currentPageNum} totalItemsCount={totalWordItems.length} setCurrentPageNum={setCurrentPageNum} />
         </Stack>
      </Stack>
   );
};
