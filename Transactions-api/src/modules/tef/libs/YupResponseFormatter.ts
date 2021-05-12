function YupResponseFormatter(errors: any): any {
  return errors.inner.map((err: any) => {
    return {
      [err.path]: err.errors,
    };
  });
}

export default YupResponseFormatter;
