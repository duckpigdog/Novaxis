import { Binary, Bug, Globe, Lock, FileCode } from 'lucide-react';

export const ctfCategories = [
  { 
    id: 'misc', 
    name: 'Misc', 
    icon: Binary, 
    subCategories: [
      { id: 'image-stego', name: '图片隐写' },
      { id: 'audio-stego', name: '音频隐写' },
      { id: 'traffic-analysis', name: '流量分析' }
    ] 
  },
  { 
    id: 'pwn', 
    name: 'Pwn', 
    icon: Bug, 
    subCategories: [
      { id: 'stack-overflow', name: '栈溢出' },
      { id: 'heap-overflow', name: '堆溢出' },
      { id: 'format-string', name: '格式化字符串' },
      { id: 'kernel-exploit', name: '内核漏洞' }
    ] 
  },
  { 
    id: 'reverse', 
    name: 'Reverse', 
    icon: FileCode, 
    subCategories: [
      { id: 'windows-reverse', name: 'Windows逆向' },
      { id: 'linux-reverse', name: 'Linux逆向' },
      { id: 'android-reverse', name: 'Android逆向' },
      { id: 'algorithm-analysis', name: '算法分析' }
    ] 
  },
  { 
    id: 'web', 
    name: 'Web', 
    icon: Globe, 
    subCategories: [
      { id: 'sql-injection', name: 'SQL注入' },
      { id: 'xss', name: 'XSS' },
      { id: 'rce', name: 'RCE' },
      { id: 'ssrf', name: 'SSRF' },
      { id: 'deserialization', name: '反序列化' }
    ] 
  },
  { 
    id: 'crypto', 
    name: 'Crypto', 
    icon: Lock, 
    subCategories: [
      { id: 'symmetric-crypto', name: '对称加密' },
      { id: 'asymmetric-crypto', name: '非对称加密' },
      { id: 'hash-function', name: '哈希函数' },
      { id: 'classical-crypto', name: '古典密码' }
    ] 
  },
];
