import { Binary, Bug, Globe, Lock, FileCode } from 'lucide-react';

export const ctfCategories = [
  { id: 'misc', name: 'Misc', icon: Binary, subCategories: ['图片隐写', '音频隐写', '流量分析', '取证'] },
  { id: 'pwn', name: 'Pwn', icon: Bug, subCategories: ['栈溢出', '堆溢出', '格式化字符串', '内核漏洞'] },
  { id: 'reverse', name: 'Reverse', icon: FileCode, subCategories: ['Windows逆向', 'Linux逆向', 'Android逆向', '算法分析'] },
  { id: 'web', name: 'Web', icon: Globe, subCategories: ['SQL注入', 'XSS', 'RCE', 'SSRF', '反序列化'] },
  { id: 'crypto', name: 'Crypto', icon: Lock, subCategories: ['对称加密', '非对称加密', '哈希函数', '古典密码'] },
];
