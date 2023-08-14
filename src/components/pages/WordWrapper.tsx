import { useContext, useEffect, useState } from 'react';
import { DetailsList } from '../controls/DetailsList';
import { PageTitle, Stack } from '../styled.components';
import { EditType, IColumn, IWord } from '../types';
import { getWordList } from '../../services/word.request';
import { AuthenticationContext } from '../contexts/context';

export const WordWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [wordItems, setWordItems] = useState<IWord[]>([]);
   // const [columns, setColumns] = useState<IColumn[]>([])

   useEffect(() => {
      if (authentication)
         getWordList(authentication!).then((response) => {
            if (response.isSuccess) {
               setWordItems(response.data);
            }
         });
   }, [authentication]);

   const columns: IColumn[] = [
      { key: 'wordCode', name: 'No', width: '5%', fieldName: 'wordCode' },
      { key: 'enWord', name: '단어', width: '20%', fieldName: 'enWord', editType: EditType.TextField  },
      { key: 'krWord', name: '뜻', width: '20%', fieldName: 'krWord', editType: EditType.TextField },
      { key: 'createDate', name: '등록 일자', width: '10%', fieldName: 'createDate', editType: EditType.Calendar },
      { key: 'isMemorize', name: '암기 여부', width: '10%', fieldName: 'isMemorize', editType: EditType.Choice },
      { key: 'remarks', name: '비고', width: '30%', fieldName: 'remarks' },
   ];

   const onSelection = (items: any) => {
      console.log(items);
   };

   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>단어장</PageTitle>
         </Stack>
         <Stack>
            <DetailsList columns={columns} items={wordItems} isCheckBox selection={onSelection} />
         </Stack>
      </Stack>
   );
};
