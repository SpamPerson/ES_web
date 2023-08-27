import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { DefaultButton, Dropdown, PageTitle, PrimaryButton, Stack, StackItem, TextField } from '../../styled.components';
import { IColumn, IUser, RoleName } from '../../types';
import { DetailsList } from '../common/controls/DetailsList';
import { Paging } from '../common/controls/Paging';
import { FiPlayCircle, FiStopCircle, FiTrash2 } from 'react-icons/fi';
import { TfiPencilAlt } from 'react-icons/tfi';
import { AuthenticationContext } from '../../contexts/context';
import { getUsers, usersActive, usersDelete, usersDisable } from '../../../services/admin.requset';
import SyncLoader from 'react-spinners/SyncLoader';
import { Dialog } from '../common/controls/Dialog';
import { warningNotification } from '../../../utils/notification.utils';
import { Modal } from '../common/controls/Modal';

export const enum UserSearchColumn {
   userId = 'userId',
   name = 'name',
   mail = 'mail',
}

const columns: IColumn[] = [
   { key: 'userId', name: '아이디', width: '20%', fieldName: 'userId' },
   { key: 'name', name: '이름', width: '20%', fieldName: 'name' },
   { key: 'mail', name: '이메일', width: '30%', fieldName: 'mail' },
   { key: 'isDeleted', name: '활성화 여부', width: '20%', fieldName: 'isDeleted' },
];

export const AdminWrapper: React.FC = () => {
   const { authentication } = useContext(AuthenticationContext);
   const [userItems, setUserItems] = useState<IUser[]>([]);
   const [totalPages, setTotalPages] = useState<number>();
   const [currentPageNum, setCurrentPageNum] = useState<number>(1);
   const [selectedItems, setSelectedItems] = useState<IUser[]>([]);
   const [searchColumn, setSearchColumn] = useState<UserSearchColumn>(UserSearchColumn.userId);
   const [searchText, setSearchText] = useState<string>('');
   const [isLoding, setIsLoding] = useState<boolean>(false);
   const [isDisableDialog, setIsDisableDialog] = useState<boolean>(false);
   const [isActiveDialog, setIsActiveDialog] = useState<boolean>(false);
   const [isDeleteDialog, setIsDeletedDialog] = useState<boolean>(false);

   useEffect(() => {
      getItems();
   }, [currentPageNum]);

   const getItems = async () => {
      setIsLoding(true);
      const response = await getUsers(authentication!, searchColumn, searchText, currentPageNum);
      setUserItems(response.data.users);
      setTotalPages(response.data.totalPage);
      setIsLoding(false);
   };

   const onSelection = (user: IUser) => {
      let newSelectedItems: IUser[] = [...selectedItems];
      if (newSelectedItems.findIndex((element) => element.userId === user.userId) === -1) {
         newSelectedItems.push(user);
      } else {
         newSelectedItems = newSelectedItems.filter((element) => element.userId !== user.userId);
      }
      setSelectedItems(newSelectedItems);
   };

   const onAllCheck = (isAllCheck: boolean) => {
      if (isAllCheck) {
         setSelectedItems(userItems);
      } else {
         setSelectedItems([]);
      }
   };

   const onClickUserActive = async () => {
      if (selectedItems.length > 0) {
         const result = await usersActive(authentication!, selectedItems);
         if (result.isSuccess) {
            let newTotalItems: IUser[] = [...userItems];
            selectedItems.forEach((item) => {
               const index = newTotalItems.findIndex((element) => element.userId === item.userId);
               newTotalItems.splice(index, 1, { ...item, isDeleted: 'N' });
            });
            setUserItems(newTotalItems);
            setSelectedItems([]);
         }
         setIsActiveDialog(false);
      }
   };

   const onClickUserDisable = async () => {
      if (selectedItems.length > 0) {
         const result = await usersDisable(authentication!, selectedItems);
         if (result.isSuccess) {
            let newTotalItems: IUser[] = [...userItems];
            selectedItems.forEach((item) => {
               const index = newTotalItems.findIndex((element) => element.userId === item.userId);
               newTotalItems.splice(index, 1, { ...item, isDeleted: 'Y' });
            });
            setUserItems(newTotalItems);
            setSelectedItems([]);
         }
         setIsDisableDialog(false);
      }
   };

   const onClickUserDelete = async () => {
      const reuslt = await usersDelete(authentication!, selectedItems);
      if (reuslt.isSuccess) {
         getItems();
      }
      setIsDeletedDialog(false);
   };

   const isIncludeAdmin = (users: IUser[]) => {
      let adminUsers: IUser[] = [];

      users.forEach((user) => {
         if (user.roles?.findIndex((element) => element.name === RoleName.Admin)! > -1) {
            adminUsers.push(user);
         }
      });

      return adminUsers;
   };

   const onChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.currentTarget.value);
   };

   const onClickSearch = () => {
      setCurrentPageNum(1);
      getItems();
   };

   const onChangeSearchColumn = (event: ChangeEvent<HTMLSelectElement>) => {
      setSearchColumn(event.currentTarget.value as UserSearchColumn);
   };

   return (
      <Stack style={{ height: '100%' }}>
         <Stack style={{ padding: '20px 50px' }}>
            <PageTitle>유저 관리</PageTitle>
         </Stack>
         <Stack style={{ padding: '0 50px' }}>
            <Stack $horizontal $horizontalAlign="space-between" $verticalAlign="end">
               <Stack $horizontal $verticalAlign="end" $childrenGap={10} style={{ userSelect: 'none' }}>
                 
                  <Stack
                     $horizontal
                     $verticalAlign="center"
                     $childrenGap={5}
                     style={{ cursor: 'pointer', color: selectedItems.length > 0 ? undefined : '#e0e0e0' }}
                     $styles={{ ':hover': { color: selectedItems.length > 0 ? 'green' : '#e0e0e0' } }}
                     onClick={() => {
                        if (selectedItems.length > 0) setIsActiveDialog(true);
                     }}
                  >
                     <FiPlayCircle color={selectedItems.length > 0 ? 'green' : '#e0e0e0'} />
                     <span>활성화</span>
                  </Stack>
                  <Stack
                     $horizontal
                     $verticalAlign="center"
                     $childrenGap={5}
                     style={{ cursor: 'pointer', color: selectedItems.length > 0 ? undefined : '#e0e0e0' }}
                     $styles={{ ':hover': { color: selectedItems.length > 0 ? 'darkRed' : '#e0e0e0' } }}
                     onClick={() => {
                        if (selectedItems.length > 0) setIsDisableDialog(true);
                     }}
                  >
                     <FiStopCircle color={selectedItems.length > 0 ? 'darkRed' : '#e0e0e0'} />
                     <span>비활성화</span>
                  </Stack>
                  <Stack
                     $horizontal
                     $verticalAlign="center"
                     $childrenGap={5}
                     style={{ cursor: 'pointer', color: selectedItems.length > 0 ? undefined : '#e0e0e0' }}
                     $styles={{ ':hover': { color: selectedItems.length > 0 ? 'red' : '#e0e0e0' } }}
                     onClick={() => {
                        if (selectedItems.length > 0) {
                           if (isIncludeAdmin(selectedItems).length === 0) {
                              setIsDeletedDialog(true);
                           } else {
                              warningNotification('관리자는 삭제할 수 없습니다.');
                           }
                        }
                     }}
                  >
                     <FiTrash2 color={selectedItems.length > 0 ? 'red' : '#e0e0e0'} />
                     <span>영구 삭제</span>
                  </Stack>
               </Stack>
               <Stack $horizontal $childrenGap={5} style={{ width: 400 }}>
                  <StackItem style={{ width: 150 }}>
                     <Dropdown defaultValue={searchColumn} onChange={onChangeSearchColumn}>
                        <option value={UserSearchColumn.userId}>아이디</option>
                        <option value={UserSearchColumn.name}>이름</option>
                        <option value={UserSearchColumn.mail}>메일</option>
                     </Dropdown>
                  </StackItem>
                  <TextField placeholder="검색할 값을 입력하세요" value={searchText} onChange={onChangeSearchText} />
                  <StackItem style={{ width: 200 }}>
                     <PrimaryButton onClick={onClickSearch}>검색</PrimaryButton>
                  </StackItem>
               </Stack>
            </Stack>
         </Stack>
         <Stack style={{ width: '100%', height: '100%' }}>
            {isLoding ? (
               <Stack $horizontalAlign="center" $verticalAlign="center" style={{ width: '100%', height: '100%' }}>
                  <SyncLoader />
               </Stack>
            ) : (
               <DetailsList
                  columns={columns}
                  items={userItems}
                  selection={onSelection}
                  selectedItems={selectedItems}
                  setAllCheck={onAllCheck}
                  isIndex
                  isCheckBox
                  isVisibleAllSelect
               />
            )}
            <Paging currentPageNum={currentPageNum} totalItemsCount={totalPages! * 10} setCurrentPageNum={setCurrentPageNum} />
         </Stack>
         <Dialog isOpen={isDisableDialog} title="계정 비활성화" subText="선택된 계정들을 비활성화 시키시겠습니까?">
            <PrimaryButton onClick={onClickUserDisable}>비활성화</PrimaryButton>
            <DefaultButton onClick={() => setIsDisableDialog(false)}>취소</DefaultButton>
         </Dialog>
         <Dialog isOpen={isActiveDialog} title="계정 활성화" subText="선택된 계정들을 활성화 시키시겠습니까?">
            <PrimaryButton onClick={onClickUserActive}>활성화</PrimaryButton>
            <DefaultButton onClick={() => setIsActiveDialog(false)}>취소</DefaultButton>
         </Dialog>
         <Dialog isOpen={isDeleteDialog} title="계정 영구 삭제" subText="선택된 계정들을 모두 삭제하시겠습니까?">
            <PrimaryButton onClick={onClickUserDelete}>삭제</PrimaryButton>
            <DefaultButton onClick={() => setIsDeletedDialog(false)}>취소</DefaultButton>
         </Dialog>
      </Stack>
   );
};
