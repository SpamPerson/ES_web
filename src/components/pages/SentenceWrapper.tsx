import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { TfiPencilAlt } from 'react-icons/tfi';
import { DefaultButton, Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField, Textarea } from '../styled.components';
import { DetailsList } from '../controls/DetailsList';
import { IColumn, ISentence, ISentenceCount, SentenceSearchColumn } from '../types';
import { Paging } from '../controls/Paging';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { AuthenticationContext } from '../contexts/context';
import { deleteSentence, getSentenceCount, getSentenceList, saveSentence } from '../../services/sentence.request';
import { PAGE_ITEM_COUNT } from '../../constants/common.constants';
import { Modal } from '../controls/Modal';
import { Dialog } from '../controls/Dialog';
import dayjs from 'dayjs';
import { warningNotification } from '../../utils/notification.utils';

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
   const [totalItems, setTotalItems] = useState<ISentence[]>([]);
   const [visibleItems, setVisibleItems] = useState<ISentence[]>([]);
   const [searchColumn, setSearchColumn] = useState<SentenceSearchColumn>(SentenceSearchColumn.EnSentence);
   const [searchText, setSearchText] = useState<string>('');
   const [selectSentences, setSelectSentences] = useState<ISentence[]>([]);
   const [sentenceCount, setSentenceCount] = useState<ISentenceCount>();
   const [isSentenceAddModal, setIsSentenceAddModal] = useState<boolean>(false);
   const [isOpenDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);
   const [enSentence, setEnSentence] = useState<string>('');
   const [krSentence, setKrSentence] = useState<string>('');
   const [isMemorize, setMemorize] = useState<string>('Y');
   const [remarks, setRemarks] = useState<string>('');
   const enSentenceInputRef = useRef<HTMLInputElement>(null);
   const krSentenceInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      getItems();
      getCount();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      if (!isSentenceAddModal) {
         resetAddModalState();
      }
   }, [isSentenceAddModal]);

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
      if (sentence.sentenceCode === -1) console.log(sentence);
      setSelectSentences(newSelectItems);
   };

   const onChangeEnSentence = (event: ChangeEvent<HTMLInputElement>) => {
      setEnSentence(event.currentTarget.value);
   };

   const onChangeKrSentence = (event: ChangeEvent<HTMLInputElement>) => {
      setKrSentence(event.currentTarget.value);
   };

   const onChangeMemorize = (event: ChangeEvent<HTMLSelectElement>) => {
      setMemorize(event.currentTarget.value);
   };

   const onChangeRemarks = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setRemarks(event.currentTarget.value);
   };

   const onClickDelete = async () => {
      if (selectSentences.length > 0) {
         let newTotalItems: ISentence[] = [...totalItems];
         const result = await deleteSentence(authentication!, selectSentences);
         if (result.isSuccess) {
            selectSentences.forEach((sentence) => {
               newTotalItems = newTotalItems.filter((element) => element.sentenceCode !== sentence.sentenceCode);
            });
            setTotalItems(newTotalItems);
            setIsDeleteDialog(false);
         }
         setSelectSentences([]);
      }
   };

   const onClickUpdate = () => {
      if (selectSentences.length === 1) {
      }
   };
   console.log(enSentence);
   const onClickSaveSentence = async () => {
      const korReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      if (enSentence === '') {
         warningNotification('영문장을 입력해주세요!');
         enSentenceInputRef.current?.focus();
      } else if (korReg.test(enSentence)) {
         warningNotification('영문장은 한글이 포함 될수 없습니다.');
         enSentenceInputRef.current?.value.replace(korReg, '');
         enSentenceInputRef.current?.focus();
      } else if (krSentence === '') {
         warningNotification('해석을 입력해 주세요');
         krSentenceInputRef.current?.focus();
      } else {
         const result = await saveSentence(authentication!, {
            userId: authentication?.user.userId!,
            enSentence: enSentence,
            krSentence: krSentence,
            isMemorize: isMemorize,
            remarks: remarks,
            createDate: dayjs().format('YYYY-MM-DD'),
         });
         if (result.isSuccess) {
            let newTotalItems: ISentence[] = [...totalItems];
            if (newTotalItems.findIndex((element) => element.sentenceCode === result.data.sentenceCode) === -1) {
               newTotalItems.push(result.data);
            }
            setTotalItems(newTotalItems);
            setIsSentenceAddModal(false);
         }
      }
   };

   const resetAddModalState = () => {
      setEnSentence('');
      setKrSentence('');
      setMemorize('Y');
      setRemarks('');
   };

   const onKeyDownAddSentence = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.code === 'Enter') onClickSaveSentence();
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
               items={visibleItems}
               selection={onSelection}
               selectedItems={selectSentences}
               setAllCheck={(isAllCheck) => {
                  if (isAllCheck) {
                     setSelectSentences(visibleItems);
                  } else {
                     setSelectSentences([]);
                  }
               }}
               isVisibleAllSelect
               isCheckBox
               isIndex
            />
         </Stack>
         <Stack>
            <Paging currentPageNum={currentPageNum} totalItemsCount={totalItems.length} setCurrentPageNum={setCurrentPageNum} />
         </Stack>

         <Modal isOpen={isSentenceAddModal} onDismiss={() => setIsSentenceAddModal(false)} width="50%" height="50%">
            <Stack
               $verticalAlign="center"
               $horizontalAlign="end"
               style={{ height: 32, backgroundColor: 'rgb(52, 152, 219)', padding: '0 5px' }}
            ></Stack>
            <Stack
               $horizontalAlign="center"
               $verticalAlign="center"
               $childrenGap={10}
               style={{ width: '100%', height: '100%', padding: 20 }}
               onKeyDown={onKeyDownAddSentence}
            >
               <TextField ref={enSentenceInputRef} placeholder="영문장" value={enSentence} onChange={onChangeEnSentence} autoFocus />
               <TextField ref={krSentenceInputRef} placeholder="해석" value={krSentence} onChange={onChangeKrSentence} />
               <Dropdown defaultValue={isMemorize} onChange={onChangeMemorize}>
                  <option value={'Y'}>Y</option>
                  <option value={'N'}>N</option>
               </Dropdown>
               <Textarea value={remarks} onChange={onChangeRemarks} />
            </Stack>
            <Stack $horizontal $horizontalAlign="end" $verticalAlign="center" $childrenGap={10} style={{ padding: 10 }}>
               <StackItem style={{ minWidth: 100 }}>
                  <PrimaryButton onClick={onClickSaveSentence}>저장</PrimaryButton>
               </StackItem>
               <StackItem style={{ minWidth: 100 }}>
                  <DefaultButton onClick={() => setIsSentenceAddModal(false)}>닫기</DefaultButton>
               </StackItem>
            </Stack>
         </Modal>
         <Dialog isOpen={isOpenDeleteDialog} title="영문장 삭제" subText="영문장을 삭제 하시겠습니까?">
            <PrimaryButton onClick={onClickDelete}>삭제</PrimaryButton>
            <DefaultButton onClick={() => setIsDeleteDialog(false)}>취소</DefaultButton>
         </Dialog>
      </Stack>
   );
};
