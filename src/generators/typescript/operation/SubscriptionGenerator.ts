import { OperationInfo } from '../../../utils/schema-parser';
import { OperationGenerator } from './OperationGenerator';
import { GeneratorConfig } from '../../../config';
import { SchemaParser } from '../../../utils/schema-parser';
import { FileManager } from '../util/FileManager';
import { TypeScriptOptions } from '../TypeScriptOptions';

/**
 * 订阅操作生成器
 * 负责生成GraphQL订阅操作的TypeScript代码
 */
export class SubscriptionGenerator extends OperationGenerator {
  constructor(
    config: GeneratorConfig,
    schemaParser: SchemaParser,
    fileManager: FileManager,
    options: TypeScriptOptions
  ) {
    super(config, schemaParser, fileManager, options);
  }

  /**
   * 获取生成器名称
   */
  public getName(): string {
    return 'SubscriptionGenerator';
  }

  /**
   * 获取操作类型
   */
  protected getOperationType(): string {
    return 'subscription';
  }

  /**
   * 获取客户端名称
   */
  protected getClientName(): string {
    return 'Subscription';
  }

  /**
   * 获取文件名
   */
  protected getFileName(): string {
    return 'subscriptions';
  }

  /**
   * 获取订阅操作列表
   */
  protected getOperations(): OperationInfo[] {
    return this.schema.subscriptions || [];
  }

  /**
   * 重写操作方法生成，以支持订阅特有的处理逻辑
   */
  protected generateOperationMethod(operation: OperationInfo): { dependencies: string[], definition: string } {
    const dependencies: Set<string> = new Set();
    const methodName = operation.name;
    const returnType = this.typeUtils.convertType(operation.returnType);
    
    if (this.typeUtils.isCustomType(operation.returnType)) {
      dependencies.add(this.typeUtils.getTypeName(operation.returnType.replace(/[\[\]!]/g, '')));
    }

    const processedArgs = operation.arguments.map(arg => {
      const argType = this.typeUtils.convertType(arg.type);
      if (this.typeUtils.isCustomType(arg.type)) {
        dependencies.add(this.typeUtils.getTypeName(arg.type.replace(/[\[\]!]/g, '')));
      }
      return {
        name: arg.name,
        type: argType,
        graphqlType: arg.type,
        required: arg.required
      };
    });

    // 生成字段选择项数组
    const fieldSelectionItems = this.fieldSelectionGenerator.generateFieldSelectionItems(operation.returnType);
    
    // 使用模板渲染操作方法
    const definition = this.templateManager.render('operation-method', {
      methodName,
      args: processedArgs,
      returnType,
      operationType: operation.type,
      hasArgs: processedArgs.length > 0,
      fieldSelectionItems,
      isSubscription: true
    });
    
    return {
      dependencies: Array.from(dependencies),
      definition
    };
  }
}