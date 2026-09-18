import '../setup.ts'
import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper.ts'

describe('no-deprecated', () => {
  it('should error on using deprecated function', () => {
    const result = lintHelper.fromContent(
      dedent`
        /** @deprecated Use newFunction instead */
        function oldFunction() {}

        oldFunction();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated class', () => {
    const result = lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewClass instead */
        class OldClass {}

        const instance = new OldClass();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated method', () => {
    const result = lintHelper.fromContent(
      dedent`
        class MyClass {
          /** @deprecated Use newMethod instead */
          oldMethod() {}
        }

        const obj = new MyClass();
        obj.oldMethod();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated property', () => {
    const result = lintHelper.fromContent(
      dedent`
        class MyClass {
          /** @deprecated Use newProp instead */
          oldProp: string;
        }

        const obj = new MyClass();
        console.log(obj.oldProp);
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated enum member', () => {
    const result = lintHelper.fromContent(
      dedent`
        enum MyEnum {
          /** @deprecated Use NEW_VALUE instead */
          OLD_VALUE
        }

        const value = MyEnum.OLD_VALUE;
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated type', () => {
    const result = lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewType instead */
        type OldType = string;

        const value: OldType = 'test';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should error on using deprecated interface', () => {
    const result = lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewInterface instead */
        interface OldInterface {
          name: string;
        }

        const obj: OldInterface = { name: 'test' };
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should allow non-deprecated code', () => {
    const result = lintHelper.fromContent(
      dedent`
        function myFunction() {}

        myFunction();
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-deprecated)',
    })
  })

  it('should allow using new replacement function', () => {
    const result = lintHelper.fromContent(
      dedent`
        /** @deprecated Use newFunction instead */
        function oldFunction() {}

        function newFunction() {}

        newFunction();
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'typescript(no-deprecated)',
    })
  })
})
