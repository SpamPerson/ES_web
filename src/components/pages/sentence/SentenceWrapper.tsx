import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { TfiPencilAlt } from 'react-icons/tfi';

import { AuthenticationContext } from '../../contexts/context';

import { DefaultButton, Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../../styled.components';
import { DetailsList } from '../common/controls/DetailsList';
import { IColumn, ISentence, ISentenceCount, SentenceEditType, SentenceSearchColumn } from '../../types';
import { deleteSentence, getSentenceCount, getSentenceList } from '../../../services/sentence.request';
import { Paging } from '../common/controls/Paging';
import { PAGE_ITEM_COUNT } from '../../../constants/common.constants';
import { Dialog } from '../common/controls/Dialog';
import { SentenceEditor } from './controls/SentenceEditor';

const columns: IColumn[] = [
   { key: 'enSentence', name: '영문장', fieldName: 'enSentence', width: '25%', fontSize: 15 },
   { key: 'krSentence', name: '해석', fieldName: 'krSentence', width: '25%', fontSize: 15 },
   { key: 'createDate', name: '등록일자', fieldName: 'createDate', width: '15%' },
   { key: 'isMemorize', name: '암기 여부', fieldName: 'isMemorize', width: '15%' },
   { key: 'remarks', name: '비고', fieldName: 'remarks', width: '20%' },
];

export const SentenceWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [currentPageNum, setCurrentPageNum] = useState<number>(1);

   const [sentenceItems, setSentenceItems] = useState<ISentence[]>([]);
   const [totalPage, setTotalPage] = useState<number>(1);

   const [searchColumn, setSearchColumn] = useState<SentenceSearchColumn>(SentenceSearchColumn.EnSentence);
   const [searchText, setSearchText] = useState<string>('');
   const [selectSentences, setSelectSentences] = useState<ISentence[]>([]);

   const [sentenceCount, setSentenceCount] = useState<ISentenceCount>();
   const [isSentenceAddModal, setIsSentenceAddModal] = useState<boolean>(false);
   const [isOpenDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);
   const [isSentenceUpdateModal, setIsSentenceUpdateModal] = useState<boolean>(false);

   useEffect(() => {
      getItems();
      getCount();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      getItems();
   }, [currentPageNum]); // eslint-disable-line react-hooks/exhaustive-deps

   const getItems = async () => {
      const result = await getSentenceList(authentication!, searchColumn, searchText, currentPageNum);
      if (result.isSuccess) {
         setSentenceItems(result.data.sentences);
         setTotalPage(result.data.totalPage);
      }
   };

   const getCount = async () => {
      const result = await getSentenceCount(authentication!);
      if (result.isSuccess) {
         setSentenceCount(result.data);
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

   const onSelection = (sentence: ISentence) => {
      let newSelectItems: ISentence[] = [...selectSentences];
      if (newSelectItems.findIndex((element) => element.sentenceCode === sentence.sentenceCode) > -1) {
         newSelectItems = newSelectItems.filter((element) => element.sentenceCode !== sentence.sentenceCode);
      } else {
         newSelectItems.push(sentence);
      }
      setSelectSentences(newSelectItems);
   };

   const onClickDelete = async () => {
      if (selectSentences.length > 0) {
         const result = await deleteSentence(authentication!, selectSentences);
         if (result.isSuccess) {
            getItems();
            setIsDeleteDialog(false);
         }
         setSelectSentences([]);
      }
   };

   const onClickUpdate = () => {
      if (selectSentences.length === 1) {
         setIsSentenceUpdateModal(true);
      }
   };

   const onSaveSentence = (sentence: ISentence, type: SentenceEditType) => {
      let newSentenceItems: ISentence[] = [...sentenceItems];
      switch (type) {
         case SentenceEditType.Create:
            getItems();
            break;
         case SentenceEditType.Update:
            const index = newSentenceItems.findIndex((element) => element.sentenceCode === sentence.sentenceCode);
            newSentenceItems.splice(index, 1, sentence);
            setSentenceItems(newSentenceItems);
            setSelectSentences([]);
            break;
      }
   };

   return (
      <Stack>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>문장노트</PageTitle>
         </Stack>
         <Stack $horizontalAlign="end" style={{ padding: '5px 40px' }}>
            <Stack $horizontal>
               <span>등록 문장 :</span>
               {sentenceCount ? sentenceCount.totalSentence : 0}
            </Stack>
            <Stack $horizontal>
               <span>암기 문장 :</span>
               {sentenceCount ? sentenceCount.memorizeSentence : 0}
            </Stack>
         </Stack>
         <Stack $horizontal $horizontalAlign="space-between" $verticalAlign="center" style={{ padding: '0 40px' }}>
            <Stack $horizontal $verticalAlign="end" $childrenGap={10}>
               <Stack
                  $horizontal
                  $verticalAlign="center"
                  $childrenGap={5}
                  onClick={() => setIsSentenceAddModal(true)}
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
                  onClick={() => {
                     if (selectSentences.length !== 0) setIsDeleteDialog(true);
                  }}
                  style={{ cursor: 'pointer', userSelect: 'none', color: selectSentences.length === 0 ? '#e0e0e0' : undefined }}
                  $styles={{
                     '&:hover': {
                        color: 'red',
                     },
                  }}
               >
                  <FiTrash2 color={selectSentences.length === 0 ? '#e0e0e0' : 'red'} />
                  <span>삭제</span>
               </Stack>
               <Stack
                  $horizontal
                  $verticalAlign="center"
                  $childrenGap={5}
                  onClick={onClickUpdate}
                  style={{ cursor: 'pointer', userSelect: 'none', color: selectSentences.length === 1 ? undefined : '#e0e0e0' }}
                  $styles={{
                     '&:hover': {
                        color: 'green',
                     },
                  }}
               >
                  <TfiPencilAlt color={selectSentences.length === 1 ? 'green' : '#e0e0e0'} />
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
            <DetailsList
               columns={columns}
               items={sentenceItems}
               selection={onSelection}
               selectedItems={selectSentences}
               setAllCheck={(isAllCheck) => {
                  if (isAllCheck) {
                     setSelectSentences(sentenceItems);
                  } else {
                     setSelectSentences([]);
                  }
               }}
               isVisibleAllSelect
               isCheckBox
               isIndex
            />
            <Paging currentPageNum={currentPageNum} totalItemsCount={totalPage * PAGE_ITEM_COUNT} setCurrentPageNum={setCurrentPageNum} />
         </Stack>
         <SentenceEditor
            type={SentenceEditType.Create}
            isOpen={isSentenceAddModal}
            onDismmiss={() => setIsSentenceAddModal(false)}
            onSaveSentence={onSaveSentence}
         />
         <SentenceEditor
            sentence={selectSentences[0]}
            type={SentenceEditType.Update}
            isOpen={isSentenceUpdateModal}
            onDismmiss={() => setIsSentenceUpdateModal(false)}
            onSaveSentence={onSaveSentence}
         />
         <Dialog isOpen={isOpenDeleteDialog} title="영문장 삭제" subText="영문장을 삭제 하시겠습니까?">
            <PrimaryButton onClick={onClickDelete}>삭제</PrimaryButton>
            <DefaultButton onClick={() => setIsDeleteDialog(false)}>취소</DefaultButton>
         </Dialog>
      </Stack>
   );
};
