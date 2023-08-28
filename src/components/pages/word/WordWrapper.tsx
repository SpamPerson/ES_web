import { useContext, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';

import { AuthenticationContext } from '../../contexts/context';

import { DetailsList } from '../common/controls/DetailsList';
import { DefaultButton, Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../../styled.components';
import { DetailsListEdit, IColumn, IDetailsListUpdateContent, IWord, IWordCount, IWordUpdate, WordSearchColumn } from '../../types';
import { deleteWords, getWordCount, getWordList, saveWord, updateWord } from '../../../services/word.request';
import { Paging } from '../common/controls/Paging';
import { PAGE_ITEM_COUNT } from '../../../constants/common.constants';
import { errorNotification } from '../../../utils/notification.utils';
import { Dialog } from '../common/controls/Dialog';

const columns: IColumn[] = [
   {
      key: 'enWord',
      name: '단어',
      width: '20%',
      fieldName: 'enWord',
      editType: DetailsListEdit.TextField,
      isInput: true,
      placeholder: '영단어를 입력해 주세요',
   },
   {
      key: 'krWord',
      name: '뜻',
      width: '20%',
      fieldName: 'krWord',
      editType: DetailsListEdit.TextField,
      isInput: true,
      placeholder: '뜻을 입력해 주세요',
   },
   { key: 'createDate', name: '등록 일자', width: '10%', fieldName: 'createDate', isInput: false, fontSize: 15 },
   { key: 'isMemorize', name: '암기 여부', width: '10%', fieldName: 'isMemorize', editType: DetailsListEdit.Choice, isInput: false },
   {
      key: 'remarks',
      name: '비고',
      width: '30%',
      fieldName: 'remarks',
      editType: DetailsListEdit.TextField,
      isInput: true,
      placeholder: '비고를 입력해 주세요',
   },
];

export const WordWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [wordItems, setWordItems] = useState<IWord[]>([]);
   const [isAddRow, setIsAddRow] = useState<boolean>(false);
   const [searchColumn, setSearchColumn] = useState<WordSearchColumn>(WordSearchColumn.EnWord);
   const [currentPageNum, setCurrentPageNum] = useState<number>(1);
   const [totalPage, setTotalPage] = useState<number>(1);
   const [searchText, setSearchText] = useState<string>('');
   const [selectItems, setSelectItems] = useState<IWord[]>([]);
   const [wordCount, setWordCount] = useState<IWordCount>();
   const [isDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);

   useEffect(() => {
      getWordItems();
      getCount();
   }, [authentication]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      getWordItems();
   }, [currentPageNum]); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      getCount();
   }, [wordItems]); // eslint-disable-line react-hooks/exhaustive-deps

   const getWordItems = async () => {
      const itemsResult = await getWordList(authentication!, searchText, searchColumn, currentPageNum);
      if (itemsResult.isSuccess) {
         setWordItems(itemsResult.data.words);
         setTotalPage(itemsResult.data.totalPage);
      }
   };

   const getCount = async () => {
      const countResult = await getWordCount(authentication!);
      if (countResult.isSuccess) {
         setWordCount(countResult.data);
      }
   };

   const onChangeSearchColumn = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSearchColumn(event.currentTarget.value as WordSearchColumn);
   };

   const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.currentTarget.value);
   };

   const onKeydownSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') getWordItems();
   };

   const onChangeValue = async (info: IDetailsListUpdateContent, value: string) => {
      let newItems: IWord[] = [...wordItems];
      let wordCode = wordItems[info.rowNum].wordCode;
      let changeWord: IWordUpdate = { columnName: info.columnName, wordCode: wordCode!, value: value };
      const result = await updateWord(authentication!, changeWord);
      if (result.isSuccess) {
         newItems.splice(
            newItems.findIndex((element) => element.wordCode === result.data.wordCode),
            1,
            result.data
         );
      } else {
         errorNotification('단어가 중복 이거나, 단어를 수정하는데 실패하였습니다.');
      }
      getCount();
      setWordItems(newItems);
   };

   const onClickAdd = () => {
      setIsAddRow(true);
   };

   const setAddItem = async (item: any) => {
      const newAddWord: IWord = {
         ...item,
         enWord: item.enWord.charAt(0).toUpperCase() + item.enWord.slice(1),
         userId: authentication?.user.userId,
         createDate: dayjs().format('YYYY-MM-DD'),
      };
      const response = await saveWord(authentication!, newAddWord);
      if (response.isSuccess) {
         getWordItems();
         setIsAddRow(false);
      } else {
         errorNotification('단어가 중복 이거나, 단어를 저장하는데 실패하였습니다.');
         setIsAddRow(false);
      }
   };

   const onSelection = (item: IWord) => {
      let newSelectItems: IWord[] = [...selectItems];
      if (newSelectItems.findIndex((element) => element.wordCode === item.wordCode) > -1) {
         newSelectItems = newSelectItems.filter((element) => element.wordCode !== item.wordCode);
      } else {
         newSelectItems.push(item);
      }
      setSelectItems(newSelectItems);
   };

   const onClickDelete = async () => {
      const result = await deleteWords(authentication!, selectItems);
      if (result.isSuccess) {
         getWordItems();
      }
      setIsDeleteDialog(false);
   };

   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <>
            <Stack style={{ padding: '20px 50px' }}>
               <PageTitle>단어장</PageTitle>
            </Stack>
            <Stack $horizontalAlign="end" style={{ padding: '5px 40px' }}>
               <Stack $horizontal $childrenGap={5} style={{ padding: '0 5px' }}>
                  <span>등록 단어 :</span>
                  {wordCount?.totalWord ? wordCount?.totalWord : 0}
               </Stack>
               <Stack $horizontal $childrenGap={5} style={{ padding: '0 5px' }}>
                  <span>암기 단어 :</span>
                  {wordCount?.memorizeWord ? wordCount?.memorizeWord : 0}
               </Stack>
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
                     onClick={() => {
                        if (selectItems.length > 0) {
                           setIsDeleteDialog(true);
                        }
                     }}
                     style={{ cursor: 'pointer', userSelect: 'none', color: selectItems.length === 0 ? '#e0e0e0' : undefined }}
                     $styles={{
                        '&:hover': {
                           color: selectItems.length === 0 ? '#e0e0e0' : 'red',
                        },
                     }}
                  >
                     <FiTrash2 color={selectItems.length === 0 ? '#e0e0e0' : 'red'} />
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
                  <TextField
                     placeholder="검색할 단어를 입력해 주세요"
                     value={searchText}
                     onChange={onChangeSearchText}
                     onKeyDown={onKeydownSearch}
                  />
                  <Stack style={{ width: 200 }}>
                     <PrimaryButton onClick={getWordItems}>검색</PrimaryButton>
                  </Stack>
               </Stack>
            </Stack>
            <Stack>
               <DetailsList
                  columns={columns}
                  items={wordItems}
                  selection={onSelection}
                  selectedItems={selectItems}
                  onChangeValue={onChangeValue}
                  isAddRow={isAddRow}
                  setIsCloseAddRow={() => setIsAddRow(false)}
                  setAddItem={setAddItem}
                  setAllCheck={(isAllCheck) => {
                     if (isAllCheck) {
                        setSelectItems(wordItems);
                     } else {
                        setSelectItems([]);
                     }
                  }}
                  isVisibleAllSelect
                  isCheckBox
                  isIndex
               />
               <Paging
                  currentPageNum={currentPageNum}
                  totalItemsCount={totalPage * PAGE_ITEM_COUNT}
                  setCurrentPageNum={setCurrentPageNum}
               />
            </Stack>
            <Dialog isOpen={isDeleteDialog} title="단어 삭제" subText="선택된 단어들을 삭제하시겠습니까?">
               <PrimaryButton onClick={onClickDelete}>삭제</PrimaryButton>
               <DefaultButton onClick={() => setIsDeleteDialog(false)}>취소</DefaultButton>
            </Dialog>
         </>
      </Stack>
   );
};
