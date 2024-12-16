import Fuse from 'fuse.js';

const fuseOptions = {
  keys: ['bookName', 'bookDetail'],  // Các trường tìm kiếm
  threshold: 0.6,  // Ngưỡng tìm kiếm (càng thấp càng chính xác)
};

const getFuseInstance = (data) => {
  return new Fuse(data, fuseOptions);
};

export { getFuseInstance };