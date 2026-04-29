export const hintMessages = {
  place: "방문하고 싶은 동네나 장소 이름을 입력해 주세요. 예) 성수동, 서울숲",
  date: "코스를 진행할 날짜를 선택해 주세요. 과거 날짜는 선택할 수 없어요.",
  time: "출발 시간을 24시간 형식으로 선택해 주세요.",
  preference: "선호하는 분위기, 활동, 음식 등을 자유롭게 적어 주세요. 최대 500자까지 가능해요.",
  transport: "이동 수단에 따라 추천 거리와 코스가 달라져요.",
} as const;

export type HintMessageKey = keyof typeof hintMessages;
