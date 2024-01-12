const boardDAO = require('./../models/boardDAO');

// Database에 쿼리를 실행하기 전 처리 작업 및 쿼리 실행후 라우터에게 전달하기 전 처리를 여기 담당
// 이러한 작업을 하는 작업을 controller라 한다. 파일명은 service를 붙임
const boardService = {
  boardList: async (item) => {
    // item => {no: 1, size: 10}
    const no = Number(item.no) - 1 || 0;
    const size = Number(item.size) || 10;

    try {
      const count = await boardDAO.totalCount();
      const resp = await boardDAO.boardList({no, size});
      const totalPage = Math.ceil(count.cnt / size); // 81 => 81 / 10 => 8에 나머지 있으면 무조건 올림 => 9
      return {code: 201, message: 'OK', no, size, totalPage, boards: resp};
    } catch (error) {
      throw new Error('회원 목록 조회 실패', error);
    }
  },

  board: async (item) => {
    try {
      const resp = await boardDAO.board(item);
      return {code: 201, message: 'OK', board: resp};
    } catch (error) {
      throw new Error('회원정보 조회 실패', error);
    }
  },

  update: async (item) => {
    console.log('service->', item);
    try {
      const resp = await boardDAO.update(item);
      return {code: 201, message: 'OK', board: resp};
    } catch (error) {
      throw new Error('회원정보 수정 실패', error);
    }
  },

  insert: async (item) => {
    try {
      const resp = await boardDAO.insert(item);
      return {code: 201, message: 'OK', board: resp};
    } catch (error) {
      throw new Error('회원정보 입력 실패', error);
    }
  },

  delete: async (item) => {
    try {
      const resp = await boardDAO.delete(item);
      return {code: 201, message: 'OK', board: resp};
    } catch (error) {
      throw new Error('회원정보 입력 실패', error);
    }
  },
};
module.exports = boardService;