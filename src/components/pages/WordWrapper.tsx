import { DetailsList } from '../controls/DetailsList';
import { PageTitle, Stack } from '../styled.components';
import { IColumn } from '../types';

export const WordWrapper: React.FC = () => {
   const columns: IColumn[] = [
      { key: 'no', name: 'No', width: '5%' },
      { key: 'word', name: '단어', width: '20%', fieldName: 'word' },
      { key: 'mean', name: '뜻', width: '20%', fieldName: 'mean' },
      { key: 'createdDate', name: '등록 일자', width: '10%', fieldName: 'createDate' },
      { key: 'isMemorizing', name: '암기 여부', width: '10%', fieldName: 'isMemorizing' },
      { key: 'remarks', name: '비고', width: '30%', fieldName: 'remarks' },
   ];

   const testItems: any[] = [
      { word: 'word', mean: 'mean', createDate: 'createDate', isMemorizing: 'isMemorizing', remarks: 'remarks' },
      { word: 'word', mean: 'mean', createDate: 'createDate', isMemorizing: 'isMemorizing', remarks: 'remarks' },
   ];
   return (
      <Stack style={{ width: '100%', height: '100%' }}>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>단어장</PageTitle>
         </Stack>
         <Stack>
            <DetailsList columns={columns} items={testItems} />
         </Stack>
      </Stack>
   );
};
