// 导入Profile类
import { Profile } from './models/classisland/Profile';

// 定义一个函数mapToObject，用于将Map对象转换为Object对象
function mapToObject<TKey, TValue>(map: Map<TKey, TValue>): Map<TKey, TValue> {
  // 创建一个新对象
  const obj = Object.create(null);
  // 遍历Map对象，将每一项赋值给新对象
  map.forEach((v, k) => {
    obj[k] = v;
  });
  // 返回新对象
  return obj;
}

// 定义一个函数saveClassIslandProfile，用于保存ClassIsland中的Profile
export function saveClassIslandProfile(profile: Profile): string {
  // 创建一个新的Profile对象
  const profileNew = Object.create(profile);
  // 将Profile中的ClassPlans、TimeLayouts和Subjects转换为Object对象
  profileNew.ClassPlans = mapToObject(profile.ClassPlans);
  profileNew.TimeLayouts = mapToObject(profile.TimeLayouts);
  profileNew.Subjects = mapToObject(profile.Subjects);
  // 返回新的Profile对象作为字符串
  return JSON.stringify(profileNew);
}
