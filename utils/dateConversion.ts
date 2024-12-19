/**
 * isoString으로 받아온 날짜를 {year}.{month}.{day} 타입으로 변환해주는 함수 입니다.
 * 현재 시간 기준 24시간 이내 일 경우 '{time}분 전', '{time}시간 전' 으로 표기 됩니다.
 * @param {string} isoString
 * @returns {string}
 */
export default function dateConversion(isoString: string): string {
  const createdDate = new Date(isoString); // 생성일
  const currentDate = new Date(); // 현재 날짜
  const timeDifference = currentDate.getTime() - createdDate.getTime(); // 오차 계산
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // 시간 환산
  const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // 분 환산

  if (hoursDifference < 1) {
    return `${minutesDifference}분 전`; // 생성한지 1시간이 안되었을 때
  } else if (hoursDifference < 24) {
    return `${hoursDifference}시간 전`; // 생성한지 24시간이 안되었을 때
  } else {
    // 24시간 이후로는 날짜로 표기
    const year = createdDate.getFullYear();
    const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
    const day = createdDate.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}.`;
  }
}
