## 介绍
本代码是基于 unet 的改进，主要是把代码从 TensorFlow 1 升级到 TensorFlow 2，并实现多GPU训练策略，同时增加代码的中文注释。

## 执行

```python
python main.py --train ./data/membrane/train --test ./data/membrane/test --steps 100 --epochs 25
```

数据使用的是 [ISBI Challenge: Segmentation of neuronal structures in EM stacks](http://brainiac2.mit.edu/isbi_challenge/).

## 依赖

- python3
- tensorflow2
- numpy
- skimage