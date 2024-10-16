from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import EC2
from diagrams.aws.database import RDS
from diagrams.aws.ml import Sagemaker

# 设置整体布局属性，包括字体大小和间距
graph_attr = {
    "fontsize": "18",  # 设置全局字体大小为18，显眼
    "nodesep": "0.6",  # 减少节点间距
    "ranksep": "0.7",  # 减少层级间距
}

node_attr = {
    "fontsize": "18",  # 每个节点的字体大小
}

with Diagram("平台供需动态与优化架构", show=True, direction="TB", graph_attr=graph_attr, node_attr=node_attr):
    
    # 顶层：平台博弈与定价策略
    with Cluster("平台博弈与定价策略"):
        platform_i = EC2("平台 i")
        platform_j = EC2("平台 j")

        platform_i >> Edge(label="设置价格") >> platform_j
        platform_j >> Edge(label="设置价格") >> platform_i

        nash_equilibrium = RDS("纳什均衡")
        platform_i >> nash_equilibrium
        platform_j >> nash_equilibrium

    # 中层：消费者需求与配送员供给
    with Cluster("消费者需求与配送员供给"):
        
        with Cluster("消费者需求"):
            demand = RDS("需求量")
            price_response = Sagemaker("价格响应")
            competition_effect = Sagemaker("竞争平台干扰")

            platform_i >> price_response >> demand
            platform_j >> competition_effect >> demand

        with Cluster("配送员供给"):
            reward = EC2("报酬")
            supply = RDS("供给量")

            demand >> Edge(label="需求驱动") >> supply
            platform_i >> Edge(label="设置报酬") >> reward
            reward >> Edge(label="吸引配送员") >> supply

    # 底层：时间动态与市场波动
    with Cluster("时间动态与市场不确定性"):
        time_decay = Sagemaker("时间衰减")
        market_fluctuation = Sagemaker("市场波动")

        demand >> Edge(label="随时间变化") >> time_decay
        supply >> Edge(label="随机波动") >> market_fluctuation

    # 成本与利润优化模块
    with Cluster("成本与利润优化"):
        profit = RDS("利润优化")
        delay_cost = EC2("延迟成本")
        operational_cost = EC2("运营成本")

        demand >> profit
        supply >> profit
        profit >> delay_cost
        delay_cost >> operational_cost

    # 增加交互与复杂性：新增模块之间的联系
    nash_equilibrium >> profit
    profit >> Edge(label="调整价格") >> platform_i
    profit >> Edge(label="调整报酬") >> reward
    time_decay >> profit
    market_fluctuation >> profit

    # 连接市场波动与时间衰减至平台博弈
    market_fluctuation >> nash_equilibrium
    time_decay >> nash_equilibrium

    # 新增交互：消费者需求与配送员供给之间的关联
    demand >> Edge(label="波动影响供给") >> supply
    supply >> Edge(label="反馈影响需求") >> demand
