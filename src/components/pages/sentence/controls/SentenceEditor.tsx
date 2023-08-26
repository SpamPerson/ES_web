import { useContext, useEffect, useRef, useState } from 'react';
import { saveSentence, updateSentence } from '../../../../services/sentence.request';
import { warningNotification } from '../../../../utils/notification.utils';
import { DefaultButton, Dropdown, PrimaryButton, Stack, StackItem, TextField, Textarea } from '../../../styled.components';
import { Modal } from '../../common/controls/Modal';
import { AuthenticationContext } from '../../../contexts/context';
import dayjs from 'dayjs';
import { ISentence, SentenceEditType } from '../../../types';

interface PSentenceEditor {
   sentence?: ISentence;
   type: SentenceEditType;
   isOpen: boolean;
   onDismmiss: () => void;
   onSaveSentence?: (sentence: ISentence, type: SentenceEditType) => void;
}

export const SentenceEditor: React.FC<PSentenceEditor> = (props) => {
   const { authentication } = useContext(AuthenticationContext);
   const [enSentence, setEnSentence] = useState<string>('');
   const [krSentence, setKrSentence] = useState<string>('');
   const [isMemorize, setIsMemorize] = useState<string>('Y');
   const [remarks, setRemarks] = useState<string>('');
   const enSentenceInputRef = useRef<HTMLInputElement>(null);
   const krSentenceInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (!props.isOpen) {
         resetModalState();
      }
   }, [props.isOpen]);

   useEffect(() => {
      if (props.sentence) {
         setEnSentence(props.sentence.enSentence);
         setKrSentence(props.sentence.krSentence);
         setIsMemorize(props.sentence.isMemorize!);
         setRemarks(props.sentence.remarks!);
      }
   }, [props.sentence]);

   const onChangeEnSentence = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEnSentence(event.currentTarget.value);
   };

   const onChangeKrSentence = (event: React.ChangeEvent<HTMLInputElement>) => {
      setKrSentence(event.currentTarget.value);
   };

   const onChangeMemorize = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setIsMemorize(event.currentTarget.value);
   };

   const onChangeRemarks = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setRemarks(event.currentTarget.value);
   };

   const onKeyDownAddSentence = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.code === 'Enter') onClickSaveSentence();
   };

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
         let result;
         switch (props.type) {
            case SentenceEditType.Create:
               result = await saveSentence(authentication!, {
                  userId: authentication?.user.userId!,
                  enSentence: enSentence,
                  krSentence: krSentence,
                  isMemorize: isMemorize,
                  remarks: remarks,
                  createDate: dayjs().format('YYYY-MM-DD'),
               });
               break;
            case SentenceEditType.Update:
               result = await updateSentence(authentication!, {
                  sentenceCode: props.sentence?.sentenceCode,
                  userId: authentication?.user.userId!,
                  enSentence: enSentence,
                  krSentence: krSentence,
                  isMemorize: isMemorize,
                  remarks: remarks,
                  createDate: dayjs().format('YYYY-MM-DD'),
               });
               break;
         }

         if (result.isSuccess) {
            props.onSaveSentence!(result.data, props.type);
            props.onDismmiss();
         }
      }
   };

   const resetModalState = () => {
      setEnSentence('');
      setKrSentence('');
      setIsMemorize('Y');
      setRemarks('');
   };

   return (
      <Modal isOpen={props.isOpen} onDismiss={props.onDismmiss} width="50%" height="50%">
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
               <DefaultButton onClick={props.onDismmiss}>닫기</DefaultButton>
            </StackItem>
         </Stack>
      </Modal>
   );
};
