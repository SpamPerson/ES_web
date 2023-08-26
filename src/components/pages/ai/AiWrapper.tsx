import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../../styled.components';
import { IAiMessage, MessageRoleType } from '../../types';
import { gptQuestion } from '../../../services/ai.request';
import { AuthenticationContext } from '../../contexts/context';
import { ConversationBox } from './controls/ConversationBox';
import { warningNotification } from '../../../utils/notification.utils';
import { BeatLoader } from 'react-spinners';

export const AiWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [content, setContent] = useState<string>('');
   const [isLoding, setIsLoding] = useState<boolean>(false);
   const [messages, setMessages] = useState<IAiMessage[]>([
      { role: MessageRoleType.Assistant, content: '안녕하세요? 무엇을 도와드릴까요?' },
   ]);

   const contentInputRef = useRef<HTMLInputElement>(null);
   const chatBoxRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (messages[messages.length - 1].role === MessageRoleType.User) {
         question();
      }
      scrollToBottom();
   }, [messages]);

   const scrollToBottom = () => {
      if (chatBoxRef.current) {
         chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight });
      }
   };

   const question = async () => {
      setIsLoding(true);
      scrollToBottom();
      const response = await gptQuestion(authentication!, messages);
      if (response.isSuccess) {
         const newMessages: IAiMessage[] = [...messages];
         newMessages.push(response.data);
         setMessages(newMessages);
      }
      setIsLoding(false);
   };

   const onClickSendMessage = () => {
      let newMessages: IAiMessage[] = [...messages];
      if (content !== '') {
         newMessages.push({ role: MessageRoleType.User, content: content });
      } else {
         warningNotification('메세지를 입력해 주세요', 'top-center');
         contentInputRef.current?.focus();
      }
      setMessages(newMessages);
      setContent('');
   };

   const onChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
      setContent(event.currentTarget.value);
      event.preventDefault();
   };

   const onKeyPressContent = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') onClickSendMessage();
   };

   return (
      <Stack style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
         <Stack style={{ padding: '10px 50px' }}>
            <PageTitle>Chat GPT</PageTitle>
         </Stack>
         <Stack style={{ height: 'calc(100% - 120px)', padding: '10px 20px' }}>
            <Stack style={{ border: '1px solid #e0e0e0', borderRadius: '5px', height: '100%', backgroundColor: '#e0e0e0' }}>
               <Stack ref={chatBoxRef} $childrenGap={5} style={{ height: '100%', overflowY: 'auto', padding: 25 }}>
                  {messages.map((message, index) => (
                     <ConversationBox key={index} item={message} />
                  ))}
                  <Stack style={{ paddingTop: 5 }}>{isLoding && <BeatLoader />}</Stack>
               </Stack>
            </Stack>
         </Stack>
         <Stack $horizontal $verticalAlign="center" $childrenGap={5} style={{ height: 50, padding: '10px 20px' }}>
            <TextField
               ref={contentInputRef}
               placeholder={isLoding ? 'GPT가 답변중입니다.. 조금만 기다려 주세요' : '대화를 입력해주세요'}
               value={content}
               onChange={onChangeContent}
               onKeyPress={onKeyPressContent}
               disabled={isLoding}
            />
            <Stack style={{ width: 60 }}>
               <PrimaryButton onClick={onClickSendMessage}>전송</PrimaryButton>
            </Stack>
         </Stack>
      </Stack>
   );
};
