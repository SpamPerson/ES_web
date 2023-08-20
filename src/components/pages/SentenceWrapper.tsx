import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { TfiPencilAlt } from 'react-icons/tfi';
import { Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../styled.components';
import { DetailsList } from '../controls/DetailsList';
import { IColumn, ISentence, SentenceSearchColumn } from '../types';
import { Paging } from '../controls/Paging';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../contexts/context';
import { getSentenceList } from '../../services/sentence.request';
import { PAGE_ITEM_COUNT } from '../../constants/common.constants';

export const SentenceWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [currentPageNum, setCurrentPageNum] = useState<number>(1);
   const [totalItems, setTotalItems] = useState<ISentence[]>([]);
   const [visibleItems, setVisibleItems] = useState<ISentence[]>([]);
   const [searchColumn, setSearchColumn] = useState<SentenceSearchColumn>(SentenceSearchColumn.EnSentence);
   const [searchText, setSearchText] = useState<string>('');

   useEffect(() => {
      getItems();
   }, []);

   useEffect(() => {
      if (totalItems.length > 0) {
         let newVisibleItems = totalItems.slice(0, PAGE_ITEM_COUNT * currentPageNum);
         setVisibleItems(newVisibleItems);
      } else {
         setVisibleItems([]);
         setCurrentPageNum(1);
      }
   }, [totalItems]); // eslint-disable-line react-hooks/exhaustive-deps

   const getItems = async () => {
      const result = await getSentenceList(authentication!, searchColumn, searchText);
      if (result.isSuccess) {
         setTotalItems(result.data);
      }
   };

   const onChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.currentTarget.value);
   };

   const onChangeSearchColumn = (event: ChangeEvent<HTMLSelectElement>) => {
      setSearchColumn(event.currentTarget.value as SentenceSearchColumn);
   };

   const onKeydownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') getItems();
   };
   const onClickAdd = () => {};

   const onClickDelete = () => {};

   const columns: IColumn[] = [
      { key: 'enSentence', name: '영문장', fieldName: 'enSentence', width: '25%', fontSize: 15 },
      { key: 'krSentence', name: '해석', fieldName: 'krSentence', width: '25%', fontSize: 15 },
      { key: 'createDate', name: '등록일자', fieldName: 'createDate', width: '15%' },
      { key: 'isMemorize', name: '암기 여부', fieldName: 'isMemorize', width: '15%' },
      { key: 'remarks', name: '비고', fieldName: 'remarks', width: '20%' },
   ];

   return (
      <Stack>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>문장노트</PageTitle>
         </Stack>
         <Stack $horizontalAlign="end" style={{ padding: '5px 40px' }}>
            <Stack $horizontal>
               <span>등록 문장 :</span>
               {0}
            </Stack>
            <Stack $horizontal>
               <span>암기 문장 :</span>
               {0}
            </Stack>
         </Stack>
         <Stack $horizontal $horizontalAlign="space-between" $verticalAlign="center" style={{ padding: '0 40px' }}>
            <Stack $horizontal $verticalAlign="end" $childrenGap={10}>
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
                  <FiTrash2 color={'red'} />
                  <span>삭제</span>
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
                  <TfiPencilAlt color={'green'} />
                  <span>수정</span>
               </Stack>
            </Stack>
            <Stack $horizontal $childrenGap={5} style={{ width: 400 }}>
               <StackItem style={{ width: 150 }}>
                  <Dropdown onChange={onChangeSearchColumn}>
                     <option value={SentenceSearchColumn.EnSentence}>영문장</option>
                     <option value={SentenceSearchColumn.KrSentence}>해석</option>
                     <option value={SentenceSearchColumn.Remarks}>비고</option>
                  </Dropdown>
               </StackItem>
               <TextField placeholder="검색할 값을 입력해 주세요" onChange={onChangeSearchText} onKeyDown={onKeydownSearch} />
               <Stack style={{ width: 200 }}>
                  <PrimaryButton onClick={getItems}>검색</PrimaryButton>
               </Stack>
            </Stack>
         </Stack>
         <Stack>
            <DetailsList columns={columns} items={visibleItems} isCheckBox isIndex />
         </Stack>
         <Stack>
            <Paging currentPageNum={currentPageNum} totalItemsCount={totalItems.length} setCurrentPageNum={setCurrentPageNum} />
         </Stack>
      </Stack>
   );
};
