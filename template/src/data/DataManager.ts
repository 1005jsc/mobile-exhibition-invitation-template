import { DataTypes } from '@/types/DataType';

type InputVersion = 'kr1' | 'en1';

// 여기에 실제 데이터를 import하세요
// import kr1 from '@/../public/input/1/kr_data.json';
// import en1 from '@/../public/input/1/en_data.json';

// 임시 기본 데이터
const defaultData: DataTypes = {
  metadata: {
    title: '프로젝트 타이틀',
    description: '프로젝트 설명',
    thumbnailImage: '/og-image.jpg',
  },
};

const manageInputData = (inputVersion: InputVersion): DataTypes => {
  switch (inputVersion) {
    case 'kr1':
      return defaultData;
    case 'en1':
      return defaultData;
    default:
      throw new Error(`Invalid input version: ${inputVersion}`);
  }
};

export const InputData = manageInputData('kr1');
